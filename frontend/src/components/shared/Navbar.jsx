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

    // Ensure theme is always available
    const currentTheme = theme || 'light';

    // Debug logging
    console.log('Navbar rendered with theme:', currentTheme, 'user:', user?.role);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
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
                                            <Link to='/browse'>
                                                <li className={`cursor-pointer font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                                    currentTheme === 'dark' 
                                                        ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                                        : 'hover:text-blue-600 hover:bg-blue-50'
                                                }`}>Browse</li>
                                            </Link>
                                            <Link to='/enhanced-search'>
                                                <li className={`cursor-pointer font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                                    currentTheme === 'dark' 
                                                        ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                                        : 'hover:text-blue-600 hover:bg-blue-50'
                                                }`}>Search</li>
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
                                    <PopoverContent className={`p-4 shadow-xl rounded-xl w-80 backdrop-blur-md border transition-all duration-300 ${
                                        currentTheme === 'dark' 
                                            ? 'bg-gradient-to-br from-slate-800/95 to-blue-900/95 border-slate-700' 
                                            : 'bg-gradient-to-br from-white/95 to-blue-50/95 border-slate-200'
                                    }`}>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-400">
                                                <AvatarImage
                                                    src={ user?.profile?.profilePhoto }
                                                    alt="User Avatar"
                                                    className="object-cover w-full h-full"
                                                />
                                            </Avatar>
                                            <div>
                                                <h1 className={`font-semibold text-lg ${
                                                    currentTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                                                }`}>{ user?.fullname }</h1>
                                                <p className={`text-sm ${
                                                    currentTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                }`}>{ user?.profile?.bio }</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            { user && user.role === 'student' ? (
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
                                                    <Link to="/resume-builder">
                                                        <Button variant="ghost" size="sm" className={`flex items-center gap-2 w-full transition-all duration-300 hover:scale-105 ${
                                                            currentTheme === 'dark' 
                                                                ? 'text-emerald-300 hover:bg-emerald-900/20 hover:text-emerald-200' 
                                                                : 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'
                                                        }`}>
                                                            <FileText className="w-4 h-4" />
                                                            Resume
                                                        </Button>
                                                    </Link>
                                                    <Link to="/interview-scheduler">
                                                        <Button variant="ghost" size="sm" className={`flex items-center gap-2 w-full transition-all duration-300 hover:scale-105 ${
                                                            currentTheme === 'dark' 
                                                                ? 'text-purple-300 hover:bg-purple-900/20 hover:text-purple-200' 
                                                                : 'text-purple-600 hover:bg-purple-50 hover:text-purple-700'
                                                        }`}>
                                                            <Calendar className="w-4 h-4" />
                                                            Interviews
                                                        </Button>
                                                    </Link>
                                                    <Link to="/job-alerts">
                                                        <Button variant="ghost" size="sm" className={`flex items-center gap-2 w-full transition-all duration-300 hover:scale-105 ${
                                                            currentTheme === 'dark' 
                                                                ? 'text-yellow-300 hover:bg-yellow-900/20 hover:text-yellow-200' 
                                                                : 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700'
                                                        }`}>
                                                            <Bell className="w-4 h-4" />
                                                            Alerts
                                                        </Button>
                                                    </Link>
                                                    <Link to="/chat-system">
                                                        <Button variant="ghost" size="sm" className={`flex items-center gap-2 w-full transition-all duration-300 hover:scale-105 ${
                                                            currentTheme === 'dark' 
                                                                ? 'text-pink-300 hover:bg-pink-900/20 hover:text-pink-200' 
                                                                : 'text-pink-600 hover:bg-pink-50 hover:text-pink-700'
                                                        }`}>
                                                            <MessageSquare className="w-4 h-4" />
                                                            Chat
                                                        </Button>
                                                    </Link>
                                                    <Link to="/social-features">
                                                        <Button variant="ghost" size="sm" className={`flex items-center gap-2 w-full transition-all duration-300 hover:scale-105 ${
                                                            currentTheme === 'dark' 
                                                                ? 'text-orange-300 hover:bg-orange-900/20 hover:text-orange-200' 
                                                                : 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'
                                                        }`}>
                                                            <Users className="w-4 h-4" />
                                                            Social
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Link to="/admin/content-moderation">
                                                        <Button variant="ghost" size="sm" className={`flex items-center gap-2 w-full transition-all duration-300 hover:scale-105 ${
                                                            currentTheme === 'dark' 
                                                                ? 'text-orange-300 hover:bg-orange-900/20 hover:text-orange-200' 
                                                                : 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'
                                                        }`}>
                                                            <Shield className="w-4 h-4" />
                                                            Moderation
                                                        </Button>
                                                    </Link>
                                                    <Link to="/admin/system-monitoring">
                                                        <Button variant="ghost" size="sm" className={`flex items-center gap-2 w-full transition-all duration-300 hover:scale-105 ${
                                                            currentTheme === 'dark' 
                                                                ? 'text-emerald-300 hover:bg-emerald-900/20 hover:text-emerald-200' 
                                                                : 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'
                                                        }`}>
                                                            <Monitor className="w-4 h-4" />
                                                            System
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ) }
                                            <div className={`pt-2 border-t transition-colors duration-300 ${
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
                                <li className={`cursor-pointer font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                    currentTheme === 'dark' 
                                        ? 'hover:text-blue-300 hover:bg-blue-900/20' 
                                        : 'hover:text-blue-600 hover:bg-blue-50'
                                }`}>
                                    <Link to="/browse">Browse</Link>
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
