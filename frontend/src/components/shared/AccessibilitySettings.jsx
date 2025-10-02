import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
    Accessibility, 
    Eye, 
    EyeOff, 
    Volume2, 
    VolumeX, 
    Contrast, 
    MousePointer, 
    Keyboard, 
    Settings,
    Zap,
    ZapOff,
    Sun,
    Moon,
    Navigation,
    Brain
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'sonner';

const AccessibilitySettings = () => {
    const { theme, toggleTheme, isDark } = useTheme();
    const [settings, setSettings] = useState({
        // Visual Accessibility
        highContrast: false,
        reducedMotion: false,
        fontSize: 16,
        lineHeight: 1.5,
        letterSpacing: 0,
        fontFamily: 'system',
        
        // Color Accessibility
        colorBlindSupport: false,
        colorScheme: 'default',
        
        // Navigation Accessibility
        keyboardNavigation: true,
        focusIndicators: true,
        skipLinks: true,
        tabOrder: 'logical',
        
        // Audio Accessibility
        screenReader: false,
        audioDescriptions: false,
        soundEffects: true,
        
        // Motor Accessibility
        largeClickTargets: false,
        stickyKeys: false,
        slowKeys: false,
        bounceKeys: false,
        
        // Cognitive Accessibility
        simplifiedInterface: false,
        clearLabels: true,
        progressIndicators: true,
        errorPrevention: true,
        
        // Device Preferences
        deviceType: 'desktop',
        inputMethod: 'mouse',
        
        // Advanced Settings
        customCSS: false,
        experimentalFeatures: false
    });

    useEffect(() => {
        // Load saved settings from localStorage
        const savedSettings = localStorage.getItem('accessibilitySettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
        
        // Apply system preferences
        applySystemPreferences();
    }, []);

    useEffect(() => {
        // Save settings to localStorage
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
        
        // Apply settings to the document
        applyAccessibilitySettings();
    }, [settings]);

    const applySystemPreferences = () => {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setSettings(prev => ({ ...prev, reducedMotion: true }));
        }
        
        // Check for high contrast preference
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            setSettings(prev => ({ ...prev, highContrast: true }));
        }
        
        // Check for color scheme preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Theme is already handled by ThemeContext
        }
    };

    const applyAccessibilitySettings = () => {
        const root = document.documentElement;
        
        // Apply visual accessibility settings
        root.style.setProperty('--font-size', `${settings.fontSize}px`);
        root.style.setProperty('--line-height', settings.lineHeight);
        root.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`);
        
        // Apply high contrast
        if (settings.highContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }
        
        // Apply reduced motion
        if (settings.reducedMotion) {
            root.classList.add('reduced-motion');
        } else {
            root.classList.remove('reduced-motion');
        }
        
        // Apply color blind support
        if (settings.colorBlindSupport) {
            root.classList.add('color-blind-support');
        } else {
            root.classList.remove('color-blind-support');
        }
        
        // Apply large click targets
        if (settings.largeClickTargets) {
            root.classList.add('large-click-targets');
        } else {
            root.classList.remove('large-click-targets');
        }
        
        // Apply simplified interface
        if (settings.simplifiedInterface) {
            root.classList.add('simplified-interface');
        } else {
            root.classList.remove('simplified-interface');
        }
        
        // Apply focus indicators
        if (settings.focusIndicators) {
            root.classList.add('focus-indicators');
        } else {
            root.classList.remove('focus-indicators');
        }
    };

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const resetToDefaults = () => {
        setSettings({
            highContrast: false,
            reducedMotion: false,
            fontSize: 16,
            lineHeight: 1.5,
            letterSpacing: 0,
            fontFamily: 'system',
            colorBlindSupport: false,
            colorScheme: 'default',
            keyboardNavigation: true,
            focusIndicators: true,
            skipLinks: true,
            tabOrder: 'logical',
            screenReader: false,
            audioDescriptions: false,
            soundEffects: true,
            largeClickTargets: false,
            stickyKeys: false,
            slowKeys: false,
            bounceKeys: false,
            simplifiedInterface: false,
            clearLabels: true,
            progressIndicators: true,
            errorPrevention: true,
            deviceType: 'desktop',
            inputMethod: 'mouse',
            customCSS: false,
            experimentalFeatures: false
        });
        toast.success('Accessibility settings reset to defaults');
    };

    const exportSettings = () => {
        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'accessibility-settings.json';
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Settings exported successfully');
    };

    const importSettings = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedSettings = JSON.parse(e.target.result);
                    setSettings(importedSettings);
                    toast.success('Settings imported successfully');
                } catch (error) {
                    toast.error('Invalid settings file');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
                        <Accessibility className="w-8 h-8 mr-3" />
                        Accessibility Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Customize your experience to make the platform more accessible and comfortable to use
                    </p>
                </div>

                {/* Quick Actions */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Zap className="w-5 h-5 mr-2" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button
                                variant="outline"
                                onClick={toggleTheme}
                                className="flex items-center justify-center"
                            >
                                {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                                {isDark ? 'Switch to Light' : 'Switch to Dark'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleSettingChange('highContrast', !settings.highContrast)}
                                className="flex items-center justify-center"
                            >
                                <Contrast className="w-4 h-4 mr-2" />
                                {settings.highContrast ? 'Disable' : 'Enable'} High Contrast
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleSettingChange('reducedMotion', !settings.reducedMotion)}
                                className="flex items-center justify-center"
                            >
                                <ZapOff className="w-4 h-4 mr-2" />
                                {settings.reducedMotion ? 'Enable' : 'Reduce'} Motion
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Settings Sections */}
                <div className="space-y-6">
                    {/* Visual Accessibility */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Eye className="w-5 h-5 mr-2" />
                                Visual Accessibility
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="highContrast">High Contrast Mode</Label>
                                        <Switch
                                            id="highContrast"
                                            checked={settings.highContrast}
                                            onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="reducedMotion">Reduce Motion</Label>
                                        <Switch
                                            id="reducedMotion"
                                            checked={settings.reducedMotion}
                                            onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="colorBlindSupport">Color Blind Support</Label>
                                        <Switch
                                            id="colorBlindSupport"
                                            checked={settings.colorBlindSupport}
                                            onCheckedChange={(checked) => handleSettingChange('colorBlindSupport', checked)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="fontSize">Font Size: {settings.fontSize}px</Label>
                                        <Slider
                                            id="fontSize"
                                            min={12}
                                            max={24}
                                            step={1}
                                            value={[settings.fontSize]}
                                            onValueChange={([value]) => handleSettingChange('fontSize', value)}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lineHeight">Line Height: {settings.lineHeight}</Label>
                                        <Slider
                                            id="lineHeight"
                                            min={1.2}
                                            max={2.0}
                                            step={0.1}
                                            value={[settings.lineHeight]}
                                            onValueChange={([value]) => handleSettingChange('lineHeight', value)}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="letterSpacing">Letter Spacing: {settings.letterSpacing}px</Label>
                                        <Slider
                                            id="letterSpacing"
                                            min={-1}
                                            max={2}
                                            step={0.1}
                                            value={[settings.letterSpacing]}
                                            onValueChange={([value]) => handleSettingChange('letterSpacing', value)}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Navigation Accessibility */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Navigation className="w-5 h-5 mr-2" />
                                Navigation Accessibility
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="keyboardNavigation">Keyboard Navigation</Label>
                                        <Switch
                                            id="keyboardNavigation"
                                            checked={settings.keyboardNavigation}
                                            onCheckedChange={(checked) => handleSettingChange('keyboardNavigation', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="focusIndicators">Focus Indicators</Label>
                                        <Switch
                                            id="focusIndicators"
                                            checked={settings.focusIndicators}
                                            onCheckedChange={(checked) => handleSettingChange('focusIndicators', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="skipLinks">Skip Links</Label>
                                        <Switch
                                            id="skipLinks"
                                            checked={settings.skipLinks}
                                            onCheckedChange={(checked) => handleSettingChange('skipLinks', checked)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="tabOrder">Tab Order</Label>
                                        <Select value={settings.tabOrder} onValueChange={(value) => handleSettingChange('tabOrder', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="logical">Logical Order</SelectItem>
                                                <SelectItem value="visual">Visual Order</SelectItem>
                                                <SelectItem value="custom">Custom Order</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Motor Accessibility */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MousePointer className="w-5 h-5 mr-2" />
                                Motor Accessibility
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="largeClickTargets">Large Click Targets</Label>
                                        <Switch
                                            id="largeClickTargets"
                                            checked={settings.largeClickTargets}
                                            onCheckedChange={(checked) => handleSettingChange('largeClickTargets', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="stickyKeys">Sticky Keys</Label>
                                        <Switch
                                            id="stickyKeys"
                                            checked={settings.stickyKeys}
                                            onCheckedChange={(checked) => handleSettingChange('stickyKeys', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="slowKeys">Slow Keys</Label>
                                        <Switch
                                            id="slowKeys"
                                            checked={settings.slowKeys}
                                            onCheckedChange={(checked) => handleSettingChange('slowKeys', checked)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="bounceKeys">Bounce Keys</Label>
                                        <Switch
                                            id="bounceKeys"
                                            checked={settings.bounceKeys}
                                            onCheckedChange={(checked) => handleSettingChange('bounceKeys', checked)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cognitive Accessibility */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Brain className="w-5 h-5 mr-2" />
                                Cognitive Accessibility
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="simplifiedInterface">Simplified Interface</Label>
                                        <Switch
                                            id="simplifiedInterface"
                                            checked={settings.simplifiedInterface}
                                            onCheckedChange={(checked) => handleSettingChange('simplifiedInterface', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="clearLabels">Clear Labels</Label>
                                        <Switch
                                            id="clearLabels"
                                            checked={settings.clearLabels}
                                            onCheckedChange={(checked) => handleSettingChange('clearLabels', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="progressIndicators">Progress Indicators</Label>
                                        <Switch
                                            id="progressIndicators"
                                            checked={settings.progressIndicators}
                                            onCheckedChange={(checked) => handleSettingChange('progressIndicators', checked)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="errorPrevention">Error Prevention</Label>
                                        <Switch
                                            id="errorPrevention"
                                            checked={settings.errorPrevention}
                                            onCheckedChange={(checked) => handleSettingChange('errorPrevention', checked)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Audio Accessibility */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Volume2 className="w-5 h-5 mr-2" />
                                Audio Accessibility
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="screenReader">Screen Reader Support</Label>
                                        <Switch
                                            id="screenReader"
                                            checked={settings.screenReader}
                                            onCheckedChange={(checked) => handleSettingChange('screenReader', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="audioDescriptions">Audio Descriptions</Label>
                                        <Switch
                                            id="audioDescriptions"
                                            checked={settings.audioDescriptions}
                                            onCheckedChange={(checked) => handleSettingChange('audioDescriptions', checked)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="soundEffects">Sound Effects</Label>
                                        <Switch
                                            id="soundEffects"
                                            checked={settings.soundEffects}
                                            onCheckedChange={(checked) => handleSettingChange('soundEffects', checked)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Keyboard Shortcuts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Keyboard className="w-5 h-5 mr-2" />
                                Keyboard Shortcuts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Toggle Theme</span>
                                        <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + T</kbd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Focus Search</span>
                                        <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + K</kbd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Skip to Content</span>
                                        <kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Close Dialog</span>
                                        <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Navigate Up</span>
                                        <kbd className="px-2 py-1 bg-muted rounded text-xs">↑</kbd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Navigate Down</span>
                                        <kbd className="px-2 py-1 bg-muted rounded text-xs">↓</kbd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Navigate Left</span>
                                        <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Navigate Right</span>
                                        <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Settings className="w-5 h-5 mr-2" />
                                Settings Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="outline" onClick={resetToDefaults}>
                                    Reset to Defaults
                                </Button>
                                <Button variant="outline" onClick={exportSettings}>
                                    Export Settings
                                </Button>
                                <Button variant="outline" asChild>
                                    <label htmlFor="import-settings">
                                        Import Settings
                                        <input
                                            id="import-settings"
                                            type="file"
                                            accept=".json"
                                            onChange={importSettings}
                                            className="hidden"
                                        />
                                    </label>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AccessibilitySettings;
