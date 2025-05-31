import React from 'react';
import { CreditCard, Calendar, User, Lock, CheckCircle2, Star, Shield } from 'lucide-react';
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
  const isDark = theme === 'dark';

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
    <div className="max-h-[90vh] overflow-y-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={`w-full max-w-md mx-auto rounded-2xl p-6 space-y-4 backdrop-blur-xl transition-all duration-300 ${isDark
              ? 'bg-gray-800/80 border border-gray-700/50 shadow-xl'
              : 'bg-white/80 border border-gray-200/50 shadow-xl'
            }`}
        >
          {/* Enhanced Header */}
          <div className="text-center mb-4">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${isDark
                ? 'bg-gradient-to-br from-yellow-600 to-orange-600 shadow-lg shadow-yellow-500/25'
                : 'bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/25'
              }`}>
              <Star className="w-6 h-6 text-white" />
            </div>

            <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Complete Pro Subscription
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
              Unlock premium features
            </p>

            {/* Pricing Card */}
            <div className={`rounded-lg p-3 mb-4 ${isDark
                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                : 'bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200'
              }`}>
              <div className="flex items-center justify-center space-x-2 mb-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Finova Pro
                </span>
              </div>
              <div className="flex items-center justify-center">
                <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  $20.00
                </span>
                <span className={`text-sm ml-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  /month
                </span>
              </div>
            </div>

            {/* Security Badge */}
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${isDark
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
              <Shield className="w-3 h-3" />
              <span>Secure Payment</span>
            </div>
          </div>

          {/* Payment Fields */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Card Number
                  </FormLabel>
                  <div className={`flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${isDark
                      ? 'bg-gray-700/50 border border-gray-600 focus-within:border-yellow-500 focus-within:bg-gray-700/70'
                      : 'bg-gray-50/50 border border-gray-200 focus-within:border-yellow-500 focus-within:bg-white'
                    }`}>
                    <CreditCard className={`w-4 h-4 mr-2 ${isDark ? 'text-yellow-400' : 'text-yellow-500'
                      }`} />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=" "
                        className={`border-0 focus-visible:ring-0 focus-visible:outline-none text-sm bg-transparent py-1 ${isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                          }`}
                        onChange={handleCardNumberChange}
                      />
                    </FormControl>
                    <div className="flex items-center space-x-1 ml-2">
                      <div className="w-5 h-3 bg-blue-600 rounded opacity-80"></div>
                      <div className="w-5 h-3 bg-yellow-500 rounded opacity-80"></div>
                    </div>
                  </div>
                  {form.formState.errors.cardNumber && (
                    <div className="text-xs text-red-400 mt-2 flex items-center">
                      <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                      <FormMessage />
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardHolder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Cardholder Name
                  </FormLabel>
                  <div className={`flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${isDark
                      ? 'bg-gray-700/50 border border-gray-600 focus-within:border-yellow-500 focus-within:bg-gray-700/70'
                      : 'bg-gray-50/50 border border-gray-200 focus-within:border-yellow-500 focus-within:bg-white'
                    }`}>
                    <User className={`w-4 h-4 mr-2 ${isDark ? 'text-yellow-400' : 'text-yellow-500'
                      }`} />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=" "
                        className={`border-0 focus-visible:ring-0 focus-visible:outline-none text-sm bg-transparent py-1 ${isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                          }`}
                      />
                    </FormControl>
                  </div>
                  {form.formState.errors.cardHolder && (
                    <div className="text-xs text-red-400 mt-2 flex items-center">
                      <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                      <FormMessage />
                    </div>
                  )}
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="expiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Expiry Date
                    </FormLabel>
                    <div className={`flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${isDark
                        ? 'bg-gray-700/50 border border-gray-600 focus-within:border-yellow-500 focus-within:bg-gray-700/70'
                        : 'bg-gray-50/50 border border-gray-200 focus-within:border-yellow-500 focus-within:bg-white'
                      }`}>
                      <Calendar className={`w-4 h-4 mr-2 ${isDark ? 'text-yellow-400' : 'text-yellow-500'
                        }`} />
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="MM/YY"
                          className={`border-0 focus-visible:ring-0 focus-visible:outline-none text-sm bg-transparent py-1 ${isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                            }`}
                          onChange={handleExpiryChange}
                        />
                      </FormControl>
                    </div>
                    {form.formState.errors.expiry && (
                      <div className="text-xs text-red-400 mt-2 flex items-center">
                        <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                        <FormMessage />
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      CVV
                    </FormLabel>
                    <div className={`flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${isDark
                        ? 'bg-gray-700/50 border border-gray-600 focus-within:border-yellow-500 focus-within:bg-gray-700/70'
                        : 'bg-gray-50/50 border border-gray-200 focus-within:border-yellow-500 focus-within:bg-white'
                      }`}>
                      <Lock className={`w-4 h-4 mr-2 ${isDark ? 'text-yellow-400' : 'text-yellow-500'
                        }`} />
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder=" "
                          maxLength={4}
                          className={`border-0 focus-visible:ring-0 focus-visible:outline-none text-sm bg-transparent py-1 ${isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                            }`}
                        />
                      </FormControl>
                    </div>
                    {form.formState.errors.cvv && (
                      <div className="text-xs text-red-400 mt-2 flex items-center">
                        <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                        <FormMessage />
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Save Card Option */}
          <div className={`rounded-lg p-3 transition-all duration-200 ${form.watch('saveCard')
              ? isDark
                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                : 'bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200'
              : isDark
                ? 'bg-gray-700/30 border border-gray-600'
                : 'bg-gray-50/50 border border-gray-200'
            }`}>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="saveCard"
                checked={form.watch('saveCard')}
                onCheckedChange={(checked) =>
                  form.setValue('saveCard', checked as boolean)
                }
                className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 focus:ring-2"
              />
              <div>
                <label
                  htmlFor="saveCard"
                  className={`text-sm font-semibold cursor-pointer ${isDark ? 'text-white' : 'text-gray-900'
                    }`}
                >
                  Save card for future payments
                </label>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Stored securely
                </p>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className={`flex items-center justify-center text-xs py-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
            <Lock className="w-3 h-3 mr-2" />
            <span>SSL encrypted</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              type="submit"
              className={`
              w-full py-3 rounded-lg font-semibold text-white
              transition-all duration-300 transform hover:scale-[1.02]
              ${isProcessing
                  ? 'opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-yellow-500/25'
                }
            `}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pay $20.00</span>
                </div>
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className={`
                w-full py-2 rounded-lg font-medium transition-all duration-200
                ${isDark
                    ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 border border-gray-600 hover:border-gray-500'
                    : 'bg-gray-50 hover:bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                  }
              `}
                disabled={isProcessing}
              >
                Cancel
              </button>
            )}
          </div>

          {/* Payment Methods */}
          <div className="flex items-center justify-center gap-1 pt-2">
            <div className="flex items-center gap-1 opacity-70">
              <div className="w-6 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">V</div>
              <div className="w-6 h-4 bg-yellow-500 rounded text-white text-xs flex items-center justify-center font-bold">M</div>
              <div className="w-6 h-4 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">A</div>
              <div className="w-6 h-4 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">D</div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PaymentForm;