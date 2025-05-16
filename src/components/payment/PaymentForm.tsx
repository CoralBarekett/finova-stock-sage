import React from 'react';
import { CreditCard, Calendar, User, Lock, CheckCircle2 } from 'lucide-react';
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

  // Modern payment container with subtle glass effect and improved responsiveness
  const containerClasses = theme === 'dark' 
    ? 'bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 shadow-xl rounded-2xl p-4 sm:p-5 md:p-6' 
    : 'bg-white/95 backdrop-blur-lg border border-gray-100 shadow-lg rounded-2xl p-4 sm:p-5 md:p-6';
    
  // Input styling with minimal focus effects - removing hover border
  const inputBaseClasses = theme === 'dark'
    ? 'bg-zinc-800/50 border-zinc-700 focus-within:ring-0 transition-all'
    : 'bg-gray-50/80 border-gray-200 focus-within:ring-0 transition-all';

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)} 
        className={`w-full max-h-[calc(100vh-4rem)] overflow-auto mx-auto ${containerClasses}`}
        style={{ maxWidth: "min(100%, 28rem)" }}
      >
        {/* Compact header with subscription details */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <div className="flex -space-x-2">
              {/* Smaller credit card icons */}
              <div className="h-6 w-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-md shadow-md transform rotate-6"></div>
              <div className="h-6 w-10 bg-gradient-to-br from-indigo-500 to-violet-700 rounded-md shadow-md"></div>
              <div className="h-6 w-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md shadow-md transform -rotate-6"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-xs font-medium text-green-500">Secure Connection</p>
          </div>
          
          <div className={`${theme === 'dark' ? 'bg-zinc-800/70' : 'bg-gray-100'} rounded-xl py-2 px-3 mb-2`}>
            <h3 className="text-base font-bold">Finova Pro Subscription</h3>
            <p className="text-xs text-muted-foreground">Unlock premium features for your financial journey</p>
            <div className="mt-1 flex items-center justify-center">
              <span className="text-lg font-bold mr-1">$20.00</span>
              <span className="text-xs text-muted-foreground">/month</span>
            </div>
          </div>
        </div>
        
        {/* Card information fields with improved styling */}
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  Card Number
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <div className={`flex items-center border rounded-lg px-3 ${inputBaseClasses}`}>
                      <Input
                        {...field}
                        placeholder="1234 5678 9012 3456"
                        className="border-0 focus-visible:ring-0 focus-visible:outline-none text-sm bg-transparent py-4"
                        onChange={handleCardNumberChange}
                      />
                      <div className="flex items-center space-x-1">
                        <div className="w-5 h-3 bg-blue-600 rounded opacity-80"></div>
                        <div className="w-5 h-3 bg-yellow-500 rounded opacity-80"></div>
                      </div>
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
                <FormLabel className="text-xs font-semibold flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Cardholder Name
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <div className={`flex items-center border rounded-lg px-3 ${inputBaseClasses}`}>
                      <Input
                        {...field}
                        placeholder=""
                        className="border-0 focus-visible:ring-0 focus-visible:outline-none text-sm bg-transparent py-4"
                      />
                    </div>
                  </FormControl>
                </div>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="expiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Expiry Date
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <div className={`flex items-center border rounded-lg px-3 ${inputBaseClasses}`}>
                        <Input
                          {...field}
                          placeholder="MM/YY"
                          className="border-0 focus-visible:ring-0 focus-visible:outline-none text-sm bg-transparent py-4"
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
                  <FormLabel className="text-xs font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    CVV
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <div className={`flex items-center border rounded-lg px-3 ${inputBaseClasses}`}>
                        <Input
                          {...field}
                          type="password"
                          placeholder="•••"
                          maxLength={4}
                          className="border-0 focus-visible:ring-0 focus-visible:outline-none text-sm bg-transparent py-4"
                        />
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Save card option with better styling */}
        <div className="mt-3 mb-2">
          <div className={`${theme === 'dark' ? 'bg-zinc-800/50' : 'bg-gray-50'} rounded-lg p-2.5`}>
            <div className="flex items-start space-x-2.5">
              <Checkbox
                id="saveCard"
                checked={form.watch('saveCard')}
                onCheckedChange={(checked) => 
                  form.setValue('saveCard', checked as boolean)
                }
                className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <div>
                <label
                  htmlFor="saveCard"
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Save card for future payments
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Your payment information will be stored securely
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Security indicators */}
        <div className="flex items-center justify-center text-xs text-muted-foreground gap-1 py-1.5 mb-3">
          <Lock className="w-3 h-3" />
          <span>128-bit SSL encrypted payment</span>
        </div>
        
        {/* Action buttons */}
        <div className="space-y-2">
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>Processing<span className="animate-pulse">...</span></>
            ) : (
              <>Pay $20.00<CheckCircle2 className="w-4 h-4 ml-1" /></>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full mt-2 py-2 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground rounded-lg text-sm transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
          )}
        </div>
        
        {/* Payment processing badges - made smaller */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <div className="flex items-center gap-2 opacity-70">
            <div className="w-8 h-5 bg-blue-600 rounded"></div>
            <div className="w-8 h-5 bg-yellow-500 rounded"></div>
            <div className="w-8 h-5 bg-red-500 rounded"></div>
            <div className="w-8 h-5 bg-green-500 rounded"></div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;