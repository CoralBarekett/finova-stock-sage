
import React, { useState } from 'react';
import { CreditCard, Calendar, User, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '@/context/ThemeContext';

const paymentFormSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits").max(19, "Card number is too long"),
  cardHolder: z.string().min(2, "Cardholder name is required"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Expiry must be in MM/YY format"),
  cvv: z.string().min(3, "CVV must be at least 3 digits").max(4, "CVV is too long"),
  saveCard: z.boolean().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  onPaymentSubmit: () => Promise<void>;
  onCancel?: () => void;
  isPro?: boolean;
  isProcessing: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  onPaymentSubmit, 
  onCancel, 
  isProcessing
}) => {
  const { theme } = useTheme();
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: '',
      cardHolder: '',
      expiry: '',
      cvv: '',
      saveCard: false
    }
  });

  const handleSubmit = async (values: PaymentFormValues) => {
    try {
      // In a real implementation, we would process the payment with Stripe or another provider
      console.log("Payment form data:", values);
      await onPaymentSubmit();
    } catch (error) {
      toast.error("Payment processing failed. Please try again.");
      console.error("Payment error:", error);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      if (value.length > 2) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
      }
    }
    
    form.setValue('expiry', value);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    form.setValue('cardNumber', value);
  };

  // ChatGPT styled frame class
  const frameClasses = theme === 'dark' 
    ? 'bg-sidebar/90 backdrop-blur-md shadow-lg border border-sidebar-border rounded-xl py-6 px-6' 
    : 'bg-white/95 backdrop-blur-md shadow-md border border-gray-200 rounded-xl py-6 px-6';
    
  // Input field styling more like ChatGPT
  const inputContainerClasses = theme === 'dark'
    ? 'bg-sidebar-accent/30 border-sidebar-border/70 hover:border-primary/70 focus-within:border-primary/90 transition-colors'
    : 'bg-background/80 border-gray-300 hover:border-primary/70 focus-within:border-primary/90 transition-colors';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={`space-y-5 ${frameClasses}`}>
        {/* Card header with secure payment indication */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <p className="text-xs text-muted-foreground">Secure Connection</p>
          </div>
          <h3 className="text-lg font-semibold">Finova Pro Subscription</h3>
          <p className="text-sm text-muted-foreground">$20.00/month</p>
        </div>
        
        {/* Credit card image at the top styled like ChatGPT/Cloud */}
        <div className="flex justify-center mb-3">
          <div className="flex gap-2">
            <div className="h-6 w-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-md shadow-sm"></div>
            <div className="h-6 w-10 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-md shadow-sm"></div>
            <div className="h-6 w-10 bg-gradient-to-br from-red-500 to-red-700 rounded-md shadow-sm"></div>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium">Card Number</FormLabel>
              <div className="relative">
                <FormControl>
                  <div className={`flex items-center border rounded-md px-3 ${inputContainerClasses}`}>
                    <CreditCard className="w-4 h-4 mr-2 text-primary/80" />
                    <Input
                      {...field}
                      placeholder="1234 5678 9012 3456"
                      className="border-0 focus-visible:ring-0 text-sm bg-transparent"
                      onChange={handleCardNumberChange}
                    />
                  </div>
                </FormControl>
              </div>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cardHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium">Cardholder Name</FormLabel>
              <div className="relative">
                <FormControl>
                  <div className={`flex items-center border rounded-md px-3 ${inputContainerClasses}`}>
                    <User className="w-4 h-4 mr-2 text-primary/80" />
                    <Input
                      {...field}
                      placeholder="John Doe"
                      className="border-0 focus-visible:ring-0 text-sm bg-transparent"
                    />
                  </div>
                </FormControl>
              </div>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiry"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">Expiry Date</FormLabel>
                <div className="relative">
                  <FormControl>
                    <div className={`flex items-center border rounded-md px-3 ${inputContainerClasses}`}>
                      <Calendar className="w-4 h-4 mr-2 text-primary/80" />
                      <Input
                        {...field}
                        placeholder="MM/YY"
                        className="border-0 focus-visible:ring-0 text-sm bg-transparent"
                        onChange={handleExpiryChange}
                      />
                    </div>
                  </FormControl>
                </div>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">CVV</FormLabel>
                <div className="relative">
                  <FormControl>
                    <div className={`flex items-center border rounded-md px-3 ${inputContainerClasses}`}>
                      <Lock className="w-4 h-4 mr-2 text-primary/80" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        className="border-0 focus-visible:ring-0 text-sm bg-transparent"
                      />
                    </div>
                  </FormControl>
                </div>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex items-center space-x-2 pt-1">
          <Checkbox
            id="saveCard"
            checked={form.watch('saveCard')}
            onCheckedChange={(checked) => 
              form.setValue('saveCard', checked as boolean)
            }
            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <label
            htmlFor="saveCard"
            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Save card for future payments
          </label>
        </div>
        
        {/* Secure payment indicator at bottom */}
        <div className="flex items-center justify-center text-xs text-muted-foreground gap-1 pt-1">
          <Lock className="w-3 h-3" />
          <span>Payments are secure and encrypted</span>
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="mt-2 sm:mt-0 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm"
              disabled={isProcessing}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-2 rounded-md text-sm font-medium"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Pay $20.00"}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;
