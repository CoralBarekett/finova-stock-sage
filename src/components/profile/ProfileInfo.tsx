import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { User, Pencil, Save, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional()
}).refine(data => {
  // If user wants to change password, all password fields are required
  if (data.newPassword && data.newPassword.length > 0) {
    if (!data.currentPassword || data.currentPassword.length === 0) {
      return false;
    }
    if (data.newPassword.length < 6) {
      return false;
    }
    if (!data.confirmPassword || data.confirmPassword.length === 0) {
      return false;
    }
  }
  return true;
}, {
  message: "Current password is required when setting a new password",
  path: ["currentPassword"],
}).refine(data => {
  // If user wants to change password, all password fields are required
  if (data.newPassword && data.newPassword.length > 0) {
    if (data.newPassword.length < 6) {
      return false;
    }
  }
  return true;
}, {
  message: "New password must be at least 6 characters",
  path: ["newPassword"],
}).refine(data => {
  // If user wants to change password, confirm password is required
  if (data.newPassword && data.newPassword.length > 0) {
    if (!data.confirmPassword || data.confirmPassword.length === 0) {
      return false;
    }
  }
  return true;
}, {
  message: "Please confirm your new password",
  path: ["confirmPassword"],
}).refine(data => {
  // If user is changing password, new and confirm must match
  if (data.newPassword && data.newPassword.length > 0 && data.confirmPassword && data.confirmPassword.length > 0) {
    return data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

interface ProfileInfoProps {
  user: any;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isDark = theme === 'dark';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSave = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    
    // Check if user is only updating name or also changing password
    const isChangingPassword = values.newPassword && values.newPassword.length > 0;
    
    // Simulate API call
    setTimeout(() => {
      if (isChangingPassword) {
        toast.success("Profile and password updated successfully!");
      } else {
        toast.success("Profile updated successfully!");
      }
      setIsLoading(false);
      setIsEditing(false);
      form.reset({
        name: values.name,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1000);
  };

  return (
    <>
      {isEditing ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Edit Profile
            </h3>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      Full Name
                    </FormLabel>
                    <div className={`flex items-center rounded-xl px-4 py-3 transition-all duration-200 ${
                      isDark 
                        ? 'bg-gray-700/50 border border-gray-600 focus-within:border-purple-500' 
                        : 'bg-gray-50/50 border border-gray-200 focus-within:border-purple-500'
                    }`}>
                      <User className={`w-5 h-5 mr-3 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                      <FormControl>
                        <Input
                          {...field}
                          className={`border-0 focus-visible:ring-0 focus-visible:outline-none bg-transparent ${
                            isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className={`border-t pt-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h4 className={`font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Change Password
                </h4>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                          Current Password
                        </FormLabel>
                        <div className={`flex items-center rounded-xl px-4 py-3 transition-all duration-200 ${
                          isDark 
                            ? 'bg-gray-700/50 border border-gray-600 focus-within:border-purple-500' 
                            : 'bg-gray-50/50 border border-gray-200 focus-within:border-purple-500'
                        }`}>
                          <Lock className={`w-5 h-5 mr-3 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className={`border-0 focus-visible:ring-0 focus-visible:outline-none bg-transparent ${
                                isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                              }`}
                              placeholder="Enter current password"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            New Password
                          </FormLabel>
                          <div className={`flex items-center rounded-xl px-4 py-3 transition-all duration-200 ${
                            isDark 
                              ? 'bg-gray-700/50 border border-gray-600 focus-within:border-purple-500' 
                              : 'bg-gray-50/50 border border-gray-200 focus-within:border-purple-500'
                          }`}>
                            <Lock className={`w-5 h-5 mr-3 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                className={`border-0 focus-visible:ring-0 focus-visible:outline-none bg-transparent ${
                                  isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                                }`}
                                placeholder="Enter new password"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            Confirm Password
                          </FormLabel>
                          <div className={`flex items-center rounded-xl px-4 py-3 transition-all duration-200 ${
                            isDark 
                              ? 'bg-gray-700/50 border border-gray-600 focus-within:border-purple-500' 
                              : 'bg-gray-50/50 border border-gray-200 focus-within:border-purple-500'
                          }`}>
                            <Lock className={`w-5 h-5 mr-3 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                className={`border-0 focus-visible:ring-0 focus-visible:outline-none bg-transparent ${
                                  isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                                }`}
                                placeholder="Confirm new password"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <div className={`flex gap-3 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className={`
                    gap-1 px-6 py-3 rounded-xl font-semibold text-white
                    transition-all duration-300 transform hover:scale-[1.02]
                    ${isLoading 
                      ? 'opacity-50 cursor-not-allowed' 
                      : isDark
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/25'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25'
                    }
                  `}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className={isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Account Information
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)} 
              className={`gap-1 ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Pencil className="w-4 h-4" /> Edit Profile
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Full Name
              </p>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user.name}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Email Address
              </p>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user.email}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Account Type
              </p>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user.pro ? "Pro Account" : "Standard Account"}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Password
              </p>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ••••••••
              </p>
            </div>
          </div>
          
          <div className={`rounded-xl p-4 flex items-center justify-between ${
            isDark ? 'bg-gray-700/30' : 'bg-gray-50'
          }`}>
            <div>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Account Security
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Enable two-factor authentication for added security
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className={isDark 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            >
              Set Up 2FA
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileInfo;