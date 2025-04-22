import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeletons/SidbarSkeleton'
import { Users } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
const sidebar = () => {

  const { users, getUsers, setSelectedUser, isUsersLoading } = useChatStore()
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers()
  }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    if (showOnlineOnly) {
      return onlineUsers.includes(user._id);
    }
    return true; // Show all users if not filtering
  });

  // const filteredUsers = showOnlineOnly
  // ? users.filter((user) => onlineUsers.includes(user._id))
  // : users;

  if (isUsersLoading) return <SidebarSkeleton />


  return (
    <aside className='h-full w-20 lg:w-72 border-r border-base-300
    flex flex-col transition-all duration-200'>
      <div className='border-b border-base-300 w-full p-5'>
        <div className='flex items-center gap-2'>
          <Users className='size-6' />
          <span className='font-medium hidden lg:block'>Friends</span>
        </div>

        {/* TODO: online filter add*/}
        <div className="lg:flex hidden items-center justify-between gap-3 mt-3 bg-base-200 px-4 py-3 rounded-lg shadow-sm">
          {/* Toggle for "Show Online Only" */}
          <label
            htmlFor="online-filter"
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              id="online-filter"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="toggle toggle-primary toggle-sm"
            />
            <span className="text-sm font-medium text-base-content">
              Show Online Only
            </span>
          </label>

          {/* Online Users Count */}
          <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1  shadow-sm">
            {onlineUsers.length - 1} Online
          </span>
        </div>

      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 hover:cursor-pointer transition-colors
              ${setSelectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""} 
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={
                  (user?.profilePic?.length > 0 && user.profilePic[0]?.url) ||
                  (import.meta.env.MODE === 'development'
                    ? '/avatar.png'
                    : '/dist/avatar.png')
                }
                alt={user.fullname}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullname}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>

    </aside>
  )
}

export default sidebar