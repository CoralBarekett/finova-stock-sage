
import React, { useState } from 'react';
import { CreditCard, Calendar, User, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Pro Plan Subscription</h3>
          <p className="text-sm text-muted-foreground">$9.99/month</p>
        </div>
        
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <div className="relative">
                <FormControl>
                  <div className="flex items-center border rounded-md px-2 bg-background">
                    <CreditCard className="w-4 h-4 mr-2 text-muted-foreground" />
                    <Input
                      {...field}
                      placeholder="1234 5678 9012 3456"
                      className="border-0 focus-visible:ring-0"
                      onChange={handleCardNumberChange}
                    />
                  </div>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cardHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cardholder Name</FormLabel>
              <div className="relative">
                <FormControl>
                  <div className="flex items-center border rounded-md px-2 bg-background">
                    <User className="w-4 h-4 mr-2 text-muted-foreground" />
                    <Input
                      {...field}
                      placeholder="John Doe"
                      className="border-0 focus-visible:ring-0"
                    />
                  </div>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <div className="relative">
                  <FormControl>
                    <div className="flex items-center border rounded-md px-2 bg-background">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder="MM/YY"
                        className="border-0 focus-visible:ring-0"
                        onChange={handleExpiryChange}
                      />
                    </div>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <div className="relative">
                  <FormControl>
                    <div className="flex items-center border rounded-md px-2 bg-background">
                      <Lock className="w-4 h-4 mr-2 text-muted-foreground" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        className="border-0 focus-visible:ring-0"
                      />
                    </div>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="saveCard"
            checked={form.watch('saveCard')}
            onCheckedChange={(checked) => 
              form.setValue('saveCard', checked as boolean)
            }
          />
          <label
            htmlFor="saveCard"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Save card for future payments
          </label>
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="mt-2 sm:mt-0 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md"
              disabled={isProcessing}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="finova-button px-4 py-2 rounded-md"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Pay $9.99"}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;
