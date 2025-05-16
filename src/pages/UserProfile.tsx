
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Not Authenticated</h2>
          <p className="mb-4 text-muted-foreground">Please login to view your profile</p>
          <Link to="/auth">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-muted-foreground mt-1">View and manage your account information</p>
      </div>

      <Tabs defaultValue="info" className="mb-6">
        <TabsList>
          <TabsTrigger value="info">Account Info</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="mt-4">
          <div className="finova-card p-6">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                <User className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Account Type</h3>
                    <p className="text-sm text-muted-foreground">Your current plan</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-lg ${user.pro ? "text-yellow-500 font-bold" : "text-muted-foreground"}`}>
                      {user.pro ? "Pro" : "Free"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Account Information</h3>
                    <p className="text-sm text-muted-foreground">Your personal details</p>
                  </div>
                  <Link to="/account/edit">
                    <Button variant="outline">Edit Profile</Button>
                  </Link>
                </div>
                
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Name</label>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Account ID</label>
                    <p className="font-medium">{user.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="subscription" className="mt-4">
          <div className="finova-card p-6">
            <h3 className="text-xl font-bold mb-4">Subscription Status</h3>
            
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Current Plan</h4>
                    <p className="text-muted-foreground text-sm">
                      {user.pro 
                        ? "You are currently on the Pro plan" 
                        : "You are currently on the Free plan"}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${user.pro ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                    {user.pro ? "Active Pro" : "Free Tier"}
                  </div>
                </div>
              </div>
              
              <div className="flex">
                {user.pro ? (
                  <Link to="/settings?tab=pro" className="w-full">
                    <Button variant="outline" className="w-full">Manage Subscription</Button>
                  </Link>
                ) : (
                  <Link to="/settings?tab=pro" className="w-full">
                    <Button className="w-full">Upgrade to Pro</Button>
                  </Link>
                )}
              </div>
              
              {user.pro && (
                <div className="p-4 bg-muted rounded-md text-sm">
                  <h4 className="font-medium mb-2">Pro Benefits</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Advanced stock analysis tools</li>
                    <li>Stock market simulations</li>
                    <li>Premium support services</li>
                    <li>Multiple portfolio management</li>
                    <li>Advanced market insights</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
