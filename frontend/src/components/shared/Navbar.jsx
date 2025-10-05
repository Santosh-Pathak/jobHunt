import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Menu, LogOut, User2, X, Briefcase, Building, FileText, Calendar, Bell, MessageSquare, Users, Settings, BarChart3, Shield, Monitor, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import apiClient from '@/utils/axiosConfig';
import { USER_API_END_POINT } from '@/utils/constant';
import { logout } from '@/redux/authSlice';
import { toast } from 'sonner';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const [menuOpen, setMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(3); // Mock unread count

    // Ensure theme is always available
    const currentTheme = theme || 'light';

    // Mock notifications data
    const mockNotifications = [
        {
            id: 1,
            title: 'New job match found',
            message: 'Software Engineer at Google matches your profile',
            time: '2 hours ago',
            read: false,
            type: 'job_match'
        },
        {
            id: 2,
            title: 'Interview scheduled',
            message: 'Your interview with Microsoft is tomorrow at 2 PM',
            time: '5 hours ago',
            read: false,
            type: 'interview'
        },
        {
            id: 3,
            title: 'Profile viewed',
            message: 'Your profile was viewed by Amazon recruiter',
            time: '1 day ago',
            read: true,
            type: 'profile_view'
        }
    ];

    // Debug logging
    console.log('Navbar rendered with theme:', currentTheme, 'user:', user?.role);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Initialize notifications
    React.useEffect(() => {
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }, []);

    // Mark notification as read
    const markAsRead = (notificationId) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === notificationId 
                    ? { ...notification, read: true }
                    : notification
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    // Mark all as read
    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
    };

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

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
            currentTheme === 'dark' 
                ? 'bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-emerald-900/95 border-slate-700' 
                : 'bg-gradient-to-r from-white/95 via-blue-50/95 to-emerald-50/95 border-slate-200'
        }`} style={{ minHeight: '64px', height: '64px' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <div
                        className={`text-2xl font-bold cursor-pointer flex items-center transition-colors duration-300 ${
                            currentTheme === 'dark' 
                                ? 'text-white hover:text-blue-300' 
                                : 'text-slate-800 hover:text-blue-600'
                        }`}
                        onClick={ () => navigate('/') }
                    >
                        <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent font-extrabold">
                            JobHunt
                        </span>
                    </div>

                    {/* Mobile Menu Toggle */ }
                    <div className="md:hidden flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className={`transition-colors duration-300 ${
                                currentTheme === 'dark' 
                                    ? 'text-white hover:text-blue-300 hover:bg-blue-900/20' 
                                    : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            {currentTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={ toggleMenu }
                            className={`transition-colors duration-300 ${
                                currentTheme === 'dark' 
                                    ? 'text-white hover:text-blue-300 hover:bg-blue-900/20' 
                                    : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            { menuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            ) }
                        </Button>
                    </div>


                    {/* Desktop Navigation */ }
                    <div className="hidden md:flex flex-1 justify-end items-center gap-4">
                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className={`transition-colors duration-300 ${
                                currentTheme === 'dark' 
                                    ? 'text-white hover:text-blue-300 hover:bg-blue-900/20' 
                                    : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            {currentTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>

                        { user ? (
                            <>
                                <ul className={`flex font-sans items-center space-x-6 transition-colors duration-300 ${
                                    currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                                }`}>
                                    { user && user.role === 'recruiter' ? (
                                        <>
                                            <Link to='/admin/dashboard'>
                                                <li className={`cursor-pointer font-semibold flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                                    currentTheme === 'dark' 
                                                        ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                                        : 'hover:text-blue-600 hover:bg-blue-50'
                                                }`}>
                                                    <BarChart3 className="w-4 h-4" />Dashboard
                                                </li>
                                            </Link>
                                            <Link to='/admin/companies'>
                                                <li className={`cursor-pointer font-semibold flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                                    currentTheme === 'dark' 
                                                        ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                                        : 'hover:text-blue-600 hover:bg-blue-50'
                                                }`}>
                                                    <Building className="w-4 h-4" />Companies
                                                </li>
                                            </Link>
                                            <Link to='/admin/jobs'>
                                                <li className={`cursor-pointer font-semibold flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                                    currentTheme === 'dark' 
                                                        ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                                        : 'hover:text-blue-600 hover:bg-blue-50'
                                                }`}>
                                                    <Briefcase className="w-4 h-4" />Jobs
                                                </li>
                                            </Link>
                                            <Link to='/admin/advanced-ats'>
                                                <li className={`cursor-pointer font-semibold flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                                    currentTheme === 'dark' 
                                                        ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                                        : 'hover:text-blue-600 hover:bg-blue-50'
                                                }`}>
                                                    <Users className="w-4 h-4" />ATS
                                                </li>
                                            </Link>
                                            <Link to='/admin/bulk-operations'>
                                                <li className={`cursor-pointer font-semibold flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                                    currentTheme === 'dark' 
                                                        ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                                        : 'hover:text-blue-600 hover:bg-blue-50'
                                                }`}>
                                                    <Settings className="w-4 h-4" />Bulk Ops
                                                </li>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link to='/'>
                                                <li className={`cursor-pointer font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                                    currentTheme === 'dark' 
                                                        ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                                        : 'hover:text-blue-600 hover:bg-blue-50'
                                                }`}>Home</li>
                                            </Link>
                                            <Link to='/jobs'>
                                                <li className={`cursor-pointer font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                                    currentTheme === 'dark' 
                                                        ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                                        : 'hover:text-blue-600 hover:bg-blue-50'
                                                }`}>Jobs</li>
                                            </Link>
                                            <Link to='/dashboard'>
                                                <li className={`cursor-pointer font-semibold flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                                    currentTheme === 'dark' 
                                                        ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                                        : 'hover:text-blue-600 hover:bg-blue-50'
                                                }`}>
                                                    <BarChart3 className="w-4 h-4" />Dashboard
                                                </li>
                                            </Link>
                                        </>
                                    ) }
                                </ul>
                                
                                {/* Notifications */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`relative transition-colors duration-300 ${
                                                currentTheme === 'dark' 
                                                    ? 'text-white hover:text-blue-300 hover:bg-blue-900/20' 
                                                    : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                                            }`}
                                        >
                                            <Bell className="h-5 w-5" />
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                                    {unreadCount > 9 ? '9+' : unreadCount}
                                                </span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className={`p-4 shadow-xl rounded-xl w-80 backdrop-blur-md border transition-all duration-300 ${
                                        currentTheme === 'dark' 
                                            ? 'bg-gradient-to-br from-slate-800/95 to-blue-900/95 border-slate-700' 
                                            : 'bg-gradient-to-br from-white/95 to-blue-50/95 border-slate-200'
                                    }`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className={`font-semibold text-lg ${
                                                currentTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                                            }`}>
                                                Notifications
                                            </h3>
                                            {unreadCount > 0 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={markAllAsRead}
                                                    className={`text-xs ${
                                                        currentTheme === 'dark' 
                                                            ? 'text-gray-400 hover:text-white' 
                                                            : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                                >
                                                    Mark all as read
                                                </Button>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-3 max-h-80 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                                            !notification.read 
                                                                ? currentTheme === 'dark'
                                                                    ? 'bg-blue-900/30 border border-blue-500/30'
                                                                    : 'bg-blue-50 border border-blue-200'
                                                                : currentTheme === 'dark'
                                                                    ? 'bg-gray-700/30 hover:bg-gray-700/50'
                                                                    : 'bg-gray-50 hover:bg-gray-100'
                                                        }`}
                                                        onClick={() => markAsRead(notification.id)}
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            <div className={`w-2 h-2 rounded-full mt-2 ${
                                                                !notification.read ? 'bg-blue-500' : 'bg-gray-400'
                                                            }`} />
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className={`text-sm font-medium ${
                                                                    currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                                                                }`}>
                                                                    {notification.title}
                                                                </h4>
                                                                <p className={`text-xs mt-1 ${
                                                                    currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                                                }`}>
                                                                    {notification.message}
                                                                </p>
                                                                <p className={`text-xs mt-1 ${
                                                                    currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                                                }`}>
                                                                    {notification.time}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className={`text-center py-8 ${
                                                    currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                    <p className="text-sm">No notifications yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {/* Profile */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Avatar className="w-8 h-8 rounded-full overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-blue-400 transition-all duration-300">
                                            <AvatarImage
                                                src={ user?.profile?.profilePhoto ? user?.profile?.profilePhoto : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq8T0hZUoX8kuRi3EZpZbUDtZ_WqqN9Ll15Q&s' }
                                                alt="User Avatar"
                                                className="object-cover w-full h-full"
                                            />
                                        </Avatar>
                                    </PopoverTrigger>
                                    <PopoverContent className={`p-6 shadow-xl rounded-xl w-72 backdrop-blur-md border transition-all duration-300 ${
                                        currentTheme === 'dark' 
                                            ? 'bg-gradient-to-br from-slate-800/95 to-blue-900/95 border-slate-700' 
                                            : 'bg-gradient-to-br from-white/95 to-blue-50/95 border-slate-200'
                                    }`}>
                                        {/* User Info */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <Avatar className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-blue-400">
                                                <AvatarImage
                                                    src={ user?.profile?.profilePhoto }
                                                    alt="User Avatar"
                                                    className="object-cover w-full h-full"
                                                />
                                            </Avatar>
                                            <div className="flex-1">
                                                <h1 className={`font-bold text-lg ${
                                                    currentTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                                                }`}>{ user?.fullname }</h1>
                                                <p className={`text-sm ${
                                                    currentTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                }`}>{ user?.profile?.bio || 'Job Seeker Profile' }</p>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="space-y-3">
                                            {/* Dashboard Access - Primary Action */}
                                            <Link to="/dashboard">
                                                <Button className={`w-full justify-start py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                                                    currentTheme === 'dark' 
                                                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}>
                                                    <BarChart3 className="w-5 h-5 mr-3" />
                                                    My Dashboard
                                                </Button>
                                            </Link>

                                            {/* Profile & Settings */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <Link to="/profile">
                                                    <Button variant="ghost" size="sm" className={`flex items-center gap-2 w-full transition-all duration-300 hover:scale-105 ${
                                                        currentTheme === 'dark' 
                                                            ? 'text-blue-300 hover:bg-blue-900/20 hover:text-blue-200' 
                                                            : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                                                    }`}>
                                                        <User2 className="w-4 h-4" />
                                                        Profile
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="sm" className={`flex items-center gap-2 w-full transition-all duration-300 hover:scale-105 ${
                                                    currentTheme === 'dark' 
                                                        ? 'text-gray-300 hover:bg-gray-700/20 hover:text-white' 
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}>
                                                    <Settings className="w-4 h-4" />
                                                    Settings
                                                </Button>
                                            </div>

                                            {/* Logout */}
                                            <div className={`pt-3 border-t transition-colors duration-300 ${
                                                currentTheme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                                            }`}>
                                                <Button
                                                    onClick={ logoutHandler }
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`flex items-center gap-2 w-full transition-all duration-300 hover:scale-105 ${
                                                        currentTheme === 'dark' 
                                                            ? 'text-red-300 hover:bg-red-900/20 hover:text-red-200' 
                                                            : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                                                    }`}
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Logout
                                                </Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </>
                        ) : (
                            <>
                                <ul className={`flex font-sans items-center space-x-6 transition-colors duration-300 ${
                                    currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                                }`}>
                                    <Link to="/">
                                        <li className={`cursor-pointer font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                            currentTheme === 'dark' 
                                                ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                                : 'hover:text-blue-600 hover:bg-blue-50'
                                        }`}>Home</li>
                                    </Link>
                                    <Link to="/jobs">
                                        <li className={`cursor-pointer font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                            currentTheme === 'dark' 
                                                ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                                : 'hover:text-blue-600 hover:bg-blue-50'
                                        }`}>Jobs</li>
                                    </Link>
                                    <Link to="/browse">
                                        <li className={`cursor-pointer font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                            currentTheme === 'dark' 
                                                ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                                : 'hover:text-blue-600 hover:bg-blue-50'
                                        }`}>Browse</li>
                                    </Link>
                                </ul>
                                <Link to="/login">
                                    <Button variant="outline" className={`transition-all duration-300 hover:scale-105 ${
                                        currentTheme === 'dark' 
                                            ? 'border-blue-400 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300' 
                                            : 'border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                                    }`}>
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className={`bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}>
                                        Signup
                                    </Button>
                                </Link>
                            </>
                        ) }
                    </div>
                </div>
            </div>

            {/* Mobile Menu */ }
            { menuOpen && (
                <div className={`absolute top-16 left-0 right-0 backdrop-blur-md border-b p-4 md:hidden z-50 transition-all duration-300 ${
                    currentTheme === 'dark' 
                        ? 'bg-gradient-to-br from-slate-900/95 to-blue-900/95 border-slate-700' 
                        : 'bg-gradient-to-br from-white/95 to-blue-50/95 border-slate-200'
                }`}>
                    <ul className={`space-y-4 transition-colors duration-300 ${
                        currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                        { user && user.role === 'recruiter' ? (
                            <>
                                <li className={`cursor-pointer font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                    currentTheme === 'dark' 
                                        ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                        : 'hover:text-blue-600 hover:bg-blue-50'
                                }`}>
                                    <Link to="/admin/dashboard">Dashboard</Link>
                                </li>
                                <li className={`cursor-pointer font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                    currentTheme === 'dark' 
                                        ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                        : 'hover:text-blue-600 hover:bg-blue-50'
                                }`}>
                                    <Link to="/admin/companies">Companies</Link>
                                </li>
                                <li className={`cursor-pointer font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                    currentTheme === 'dark' 
                                        ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                        : 'hover:text-blue-600 hover:bg-blue-50'
                                }`}>
                                    <Link to="/admin/jobs">Jobs</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className={`cursor-pointer font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                    currentTheme === 'dark' 
                                        ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                        : 'hover:text-blue-600 hover:bg-blue-50'
                                }`}>
                                    <Link to="/">Home</Link>
                                </li>
                                <li className={`cursor-pointer font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                    currentTheme === 'dark' 
                                        ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                        : 'hover:text-blue-600 hover:bg-blue-50'
                                }`}>
                                    <Link to="/jobs">Jobs</Link>
                                </li>
                            </>
                        ) }
                        { !user && (
                            <div className="flex flex-col gap-2">
                                <Link to="/login">
                                    <Button variant="outline" className={`transition-all duration-300 hover:scale-105 ${
                                        currentTheme === 'dark' 
                                            ? 'border-blue-400 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300' 
                                            : 'border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                                    }`}>
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className={`bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}>
                                        Signup
                                    </Button>
                                </Link>
                            </div>
                        ) }
                    </ul>
                </div>
            ) }
        </nav>
    );
};

export default Navbar;
