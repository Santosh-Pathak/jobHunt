import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, User, Settings, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useTheme } from '../../contexts/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '@/utils/axiosConfig';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser, logout } from '@/redux/authSlice';
import { toast } from 'sonner';

const EnhancedNavbar = () => {
    const { theme, toggleTheme, isDark } = useTheme();
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const logoutHandler = async () => {
        try {
            const res = await apiClient.get(`${USER_API_END_POINT}/logout`);
            if (res.data.success) {
                dispatch(logout());
                navigate('/');
                toast.success(res.data.message);
            } else {
                // Even if server response is not successful, clear local state
                dispatch(logout());
                navigate('/');
                toast.success('Logged out successfully');
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout request fails, clear local state
            dispatch(logout());
            navigate('/');
            toast.success('Logged out successfully');
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await apiClient.get(`${USER_API_END_POINT}/notifications`);
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.notifications.filter(n => !n.read).length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    return (
        <motion.nav 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isDark 
                    ? 'bg-gray-900/95 backdrop-blur-md border-gray-800' 
                    : 'bg-white/95 backdrop-blur-md border-gray-200'
            } border-b`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <motion.div
                        className="text-2xl font-bold cursor-pointer flex items-center"
                        onClick={() => navigate('/')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>
                            Hire
                        </span>
                        <span className="text-blue-500">Hub</span>
                    </motion.div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {user ? (
                            <>
                                {user.role === 'recruiter' ? (
                                    <>
                                        <Link to='/admin/companies'>
                                            <Button variant="ghost" className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
                                                Companies
                                            </Button>
                                        </Link>
                                        <Link to='/admin/jobs'>
                                            <Button variant="ghost" className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
                                                Jobs
                                            </Button>
                                        </Link>
                                        <Link to='/admin/dashboard'>
                                            <Button variant="ghost" className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
                                                Dashboard
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to='/'>
                                            <Button variant="ghost" className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
                                                Home
                                            </Button>
                                        </Link>
                                        <Link to='/jobs'>
                                            <Button variant="ghost" className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
                                                Jobs
                                            </Button>
                                        </Link>
                                        <Link to='/browse'>
                                            <Button variant="ghost" className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
                                                Browse
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Link to="/">
                                    <Button variant="ghost" className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
                                        Home
                                    </Button>
                                </Link>
                                <Link to="/jobs">
                                    <Button variant="ghost" className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
                                        Jobs
                                    </Button>
                                </Link>
                                <Link to="/browse">
                                    <Button variant="ghost" className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
                                        Browse
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                            >
                                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                        </motion.div>

                        {user ? (
                            <>
                                {/* Notifications */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                            <Button variant="ghost" size="icon" className="relative">
                                                <Bell className="h-5 w-5" />
                                                {unreadCount > 0 && (
                                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                                                        {unreadCount}
                                                    </Badge>
                                                )}
                                            </Button>
                                        </motion.div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-0" align="end">
                                        <div className="p-4 border-b">
                                            <h4 className="font-semibold">Notifications</h4>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.slice(0, 5).map((notification) => (
                                                    <div key={notification._id} className="p-3 border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                                        <div className="flex items-start space-x-3">
                                                            <div className={`w-2 h-2 rounded-full mt-2 ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium">{notification.title}</p>
                                                                <p className="text-xs text-gray-500">{notification.message}</p>
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-gray-500">
                                                    No notifications yet
                                                </div>
                                            )}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {/* User Menu */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Avatar className="w-8 h-8 cursor-pointer">
                                                <AvatarImage
                                                    src={user?.profile?.profilePhoto || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq8T0hZUoX8kuRi3EZpZbUDtZ_WqqN9Ll15Q&s'}
                                                    alt="User Avatar"
                                                />
                                            </Avatar>
                                        </motion.div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 p-4" align="end">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage
                                                    src={user?.profile?.profilePhoto}
                                                    alt="User Avatar"
                                                />
                                            </Avatar>
                                            <div>
                                                <h4 className="font-semibold">{user?.fullName}</h4>
                                                <p className="text-sm text-gray-500">{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {user.role === 'student' && (
                                                <Link to="/profile">
                                                    <Button variant="ghost" className="w-full justify-start">
                                                        <User className="w-4 h-4 mr-2" />
                                                        Profile
                                                    </Button>
                                                </Link>
                                            )}
                                            <Button variant="ghost" className="w-full justify-start">
                                                <Settings className="w-4 h-4 mr-2" />
                                                Settings
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                className="w-full justify-start text-red-600 hover:text-red-700"
                                                onClick={logoutHandler}
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Logout
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login">
                                    <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                                        Signup
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default EnhancedNavbar;
