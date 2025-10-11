import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Globe, Calendar, Users, Building2, Mail, Phone } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useTheme } from '../../contexts/ThemeContext';

const CompanyDetailsModal = ({ company, isOpen, onClose }) => {
    const { isDark } = useTheme();

    if (!company) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl ${
                                isDark ? 'bg-card border border-border' : 'bg-white border border-gray-200'
                            }`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            {/* Header */}
                            <div className={`flex items-center justify-between p-6 border-b ${
                                isDark ? 'border-border' : 'border-gray-200'
                            }`}>
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage 
                                            src={company.logo} 
                                            alt={company.name}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className={`text-xl font-bold ${
                                            isDark ? 'bg-muted text-muted-foreground' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {company.name?.charAt(0) || 'C'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className={`text-2xl font-bold ${
                                            isDark ? 'text-foreground' : 'text-gray-900'
                                        }`}>
                                            {company.name}
                                        </h2>
                                        <p className={`text-sm ${
                                            isDark ? 'text-muted-foreground' : 'text-gray-600'
                                        }`}>
                                            Company Details
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className={`h-8 w-8 p-0 rounded-full ${
                                        isDark 
                                            ? 'hover:bg-accent hover:text-accent-foreground' 
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                <div className="space-y-6">
                                    {/* Basic Information */}
                                    <Card className={`${
                                        isDark ? 'bg-muted/50 border-border' : 'bg-gray-50 border-gray-200'
                                    }`}>
                                        <CardHeader className="pb-3">
                                            <CardTitle className={`text-lg flex items-center ${
                                                isDark ? 'text-foreground' : 'text-gray-900'
                                            }`}>
                                                <Building2 className="h-5 w-5 mr-2" />
                                                Basic Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className={`text-sm font-medium ${
                                                        isDark ? 'text-muted-foreground' : 'text-gray-600'
                                                    }`}>
                                                        Company Name
                                                    </label>
                                                    <p className={`text-base ${
                                                        isDark ? 'text-foreground' : 'text-gray-900'
                                                    }`}>
                                                        {company.name || 'Not specified'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className={`text-sm font-medium ${
                                                        isDark ? 'text-muted-foreground' : 'text-gray-600'
                                                    }`}>
                                                        Industry
                                                    </label>
                                                    <p className={`text-base ${
                                                        isDark ? 'text-foreground' : 'text-gray-900'
                                                    }`}>
                                                        {company.industry || 'Not specified'}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {company.description && (
                                                <div>
                                                    <label className={`text-sm font-medium ${
                                                        isDark ? 'text-muted-foreground' : 'text-gray-600'
                                                    }`}>
                                                        Description
                                                    </label>
                                                    <p className={`text-base mt-1 ${
                                                        isDark ? 'text-foreground' : 'text-gray-900'
                                                    }`}>
                                                        {company.description}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Contact Information */}
                                    <Card className={`${
                                        isDark ? 'bg-muted/50 border-border' : 'bg-gray-50 border-gray-200'
                                    }`}>
                                        <CardHeader className="pb-3">
                                            <CardTitle className={`text-lg flex items-center ${
                                                isDark ? 'text-foreground' : 'text-gray-900'
                                            }`}>
                                                <Globe className="h-5 w-5 mr-2" />
                                                Contact Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {company.website && (
                                                    <div className="flex items-center space-x-2">
                                                        <Globe className={`h-4 w-4 ${
                                                            isDark ? 'text-muted-foreground' : 'text-gray-600'
                                                        }`} />
                                                        <div>
                                                            <label className={`text-sm font-medium ${
                                                                isDark ? 'text-muted-foreground' : 'text-gray-600'
                                                            }`}>
                                                                Website
                                                            </label>
                                                            <p className={`text-base ${
                                                                isDark ? 'text-primary' : 'text-blue-600'
                                                            }`}>
                                                                <a 
                                                                    href={company.website} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="hover:underline"
                                                                >
                                                                    {company.website}
                                                                </a>
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {company.location && (
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className={`h-4 w-4 ${
                                                            isDark ? 'text-muted-foreground' : 'text-gray-600'
                                                        }`} />
                                                        <div>
                                                            <label className={`text-sm font-medium ${
                                                                isDark ? 'text-muted-foreground' : 'text-gray-600'
                                                            }`}>
                                                                Location
                                                            </label>
                                                            <p className={`text-base ${
                                                                isDark ? 'text-foreground' : 'text-gray-900'
                                                            }`}>
                                                                {company.location}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Additional Information */}
                                    <Card className={`${
                                        isDark ? 'bg-muted/50 border-border' : 'bg-gray-50 border-gray-200'
                                    }`}>
                                        <CardHeader className="pb-3">
                                            <CardTitle className={`text-lg flex items-center ${
                                                isDark ? 'text-foreground' : 'text-gray-900'
                                            }`}>
                                                <Calendar className="h-5 w-5 mr-2" />
                                                Additional Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className={`text-sm font-medium ${
                                                        isDark ? 'text-muted-foreground' : 'text-gray-600'
                                                    }`}>
                                                        Created Date
                                                    </label>
                                                    <p className={`text-base ${
                                                        isDark ? 'text-foreground' : 'text-gray-900'
                                                    }`}>
                                                        {formatDate(company.createdAt)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className={`text-sm font-medium ${
                                                        isDark ? 'text-muted-foreground' : 'text-gray-600'
                                                    }`}>
                                                        Last Updated
                                                    </label>
                                                    <p className={`text-base ${
                                                        isDark ? 'text-foreground' : 'text-gray-900'
                                                    }`}>
                                                        {formatDate(company.updatedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {company.status && (
                                                <div>
                                                    <label className={`text-sm font-medium ${
                                                        isDark ? 'text-muted-foreground' : 'text-gray-600'
                                                    }`}>
                                                        Status
                                                    </label>
                                                    <div className="mt-1">
                                                        <Badge 
                                                            variant={company.status === 'active' ? 'default' : 'secondary'}
                                                            className={`${
                                                                company.status === 'active' 
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                                            }`}
                                                        >
                                                            {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className={`flex items-center justify-end space-x-3 p-6 border-t ${
                                isDark ? 'border-border' : 'border-gray-200'
                            }`}>
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className={`${
                                        isDark 
                                            ? 'border-border text-foreground hover:bg-accent hover:text-accent-foreground' 
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Close
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CompanyDetailsModal;
