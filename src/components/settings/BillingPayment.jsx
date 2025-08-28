import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Receipt, 
  Crown, 
  Zap, 
  Star,
  CheckCircle,
  AlertCircle,
  Download,
  Calendar,
  DollarSign
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const BillingPayment = () => {
  const [currentPlan] = useState({
    name: 'Free',
    price: '$0',
    period: 'month',
    status: 'active',
    nextBilling: null,
    features: [
      'Basic workout plans',
      'Progress tracking',
      'Community access',
      'Standard support'
    ]
  });

  const [availablePlans] = useState([
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99',
      period: 'month',
      originalPrice: '$19.99',
      discount: '50% off',
      popular: true,
      features: [
        'AI-powered workout plans',
        'Advanced analytics & insights',
        'Personal trainer consultation',
        'Priority support',
        'Ad-free experience',
        'Custom meal plans'
      ]
    },
    {
      id: 'elite',
      name: 'Elite',
      price: '$19.99',
      period: 'month',
      originalPrice: '$39.99',
      discount: '50% off',
      popular: false,
      features: [
        'Everything in Premium',
        '1-on-1 coaching sessions',
        'Nutritionist consultation',
        'Exclusive content & workshops',
        'Advanced progress tracking',
        '24/7 support'
      ]
    }
  ]);

  const [paymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiry: '12/25',
      isDefault: true,
      name: 'John Doe'
    },
    {
      id: 2,
      type: 'card',
      last4: '8888',
      brand: 'Mastercard',
      expiry: '08/26',
      isDefault: false,
      name: 'John Doe'
    }
  ]);

  const [billingHistory] = useState([
    {
      id: 1,
      date: '2024-01-15',
      amount: '$9.99',
      status: 'paid',
      description: 'Premium Plan - Monthly',
      invoice: 'INV-2024-001'
    },
    {
      id: 2,
      date: '2023-12-15',
      amount: '$9.99',
      status: 'paid',
      description: 'Premium Plan - Monthly',
      invoice: 'INV-2023-012'
    },
    {
      id: 3,
      date: '2023-11-15',
      amount: '$19.99',
      status: 'paid',
      description: 'Elite Plan - Monthly',
      invoice: 'INV-2023-011'
    }
  ]);

  const [showAddPayment, setShowAddPayment] = useState(false);

  const handlePlanUpgrade = (planId) => {
    console.log('Upgrading to plan:', planId);
    // Handle plan upgrade logic
  };

  const handlePlanDowngrade = () => {
    console.log('Downgrading plan');
    // Handle plan downgrade logic
  };

  const handleCancelSubscription = () => {
    console.log('Cancelling subscription');
    // Handle subscription cancellation logic
  };

  const addPaymentMethod = () => {
    setShowAddPayment(true);
    // Handle adding payment method logic
  };

  const removePaymentMethod = (methodId) => {
    console.log('Removing payment method:', methodId);
    // Handle payment method removal logic
  };

  const setDefaultPayment = (methodId) => {
    console.log('Setting default payment method:', methodId);
    // Handle setting default payment method logic
  };

  const downloadInvoice = (invoiceId) => {
    console.log('Downloading invoice:', invoiceId);
    // Handle invoice download logic
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-2">
          <CreditCard className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
            Billing & Payment
          </h2>
        </div>
        <p className="text-day-text-secondary dark:text-night-text-secondary">
          Manage your subscription, payment methods, and billing history
        </p>
      </motion.div>

      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-600" />
                <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                  Current Plan
                </h3>
              </div>
              <Badge variant="success" size="lg">
                {currentPlan.status}
              </Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-3xl font-bold text-day-text-primary dark:text-night-text-primary">
                    {currentPlan.price}
                  </span>
                  <span className="text-day-text-secondary dark:text-night-text-secondary">
                    /{currentPlan.period}
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-day-text-primary dark:text-night-text-primary mb-3">
                  {currentPlan.name} Plan
                </h4>
                <ul className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-day-text-primary dark:text-night-text-primary">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col justify-center space-y-3">
                {currentPlan.name === 'Free' ? (
                  <Button
                    variant="primary"
                    onClick={() => handlePlanUpgrade('premium')}
                    className="w-full"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handlePlanDowngrade}
                      className="w-full"
                    >
                      Downgrade Plan
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleCancelSubscription}
                      className="w-full text-red-600 hover:text-red-700"
                    >
                      Cancel Subscription
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Available Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <Card.Header>
            <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
              Available Plans
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availablePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    plan.popular
                      ? 'border-day-accent-primary dark:border-night-accent bg-day-accent-primary/5 dark:bg-night-accent/5'
                      : 'border-day-border dark:border-night-border hover:border-day-accent-primary/50 dark:hover:border-night-accent/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="flex justify-center mb-4">
                      <Badge variant="primary" size="sm">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-2">
                      {plan.name}
                    </h4>
                    <div className="flex items-baseline justify-center space-x-2 mb-2">
                      <span className="text-3xl font-bold text-day-text-primary dark:text-night-text-primary">
                        {plan.price}
                      </span>
                      <span className="text-day-text-secondary dark:text-night-text-secondary">
                        /{plan.period}
                      </span>
                    </div>
                    {plan.originalPrice && (
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm text-gray-500 line-through">
                          {plan.originalPrice}
                        </span>
                        <Badge variant="success" size="sm">
                          {plan.discount}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-day-text-primary dark:text-night-text-primary">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.popular ? "primary" : "outline"}
                    onClick={() => handlePlanUpgrade(plan.id)}
                    className="w-full"
                  >
                    {currentPlan.name === plan.name ? 'Current Plan' : `Upgrade to ${plan.name}`}
                  </Button>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                Payment Methods
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={addPaymentMethod}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-black rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-day-text-primary dark:text-night-text-primary">
                          {method.brand} •••• {method.last4}
                        </span>
                        {method.isDefault && (
                          <Badge variant="primary" size="sm">Default</Badge>
                        )}
                      </div>
                      <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                        Expires {method.expiry} • {method.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDefaultPayment(method.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePaymentMethod(method.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-gray-600" />
              <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                Billing History
              </h3>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {billingHistory.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-black rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Receipt className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-day-text-primary dark:text-night-text-primary">
                          {invoice.description}
                        </span>
                        <Badge variant={getStatusColor(invoice.status)} size="sm">
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                        {invoice.invoice} • {invoice.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-day-text-primary dark:text-night-text-primary">
                      {invoice.amount}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadInvoice(invoice.invoice)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Billing Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <Card.Header>
            <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
              Billing Information
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                  Billing Address
                </label>
                <div className="p-3 bg-gray-50 dark:bg-black rounded-lg">
                  <p className="text-sm text-day-text-primary dark:text-night-text-primary">
                    John Doe<br />
                    123 Fitness Street<br />
                    New Delhi, Delhi 110001<br />
                    India
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                  Tax Information
                </label>
                <div className="p-3 bg-gray-50 dark:bg-black rounded-lg">
                  <p className="text-sm text-day-text-primary dark:text-night-text-primary">
                    GST Number: 07ABCDE1234F1Z5<br />
                    Business Name: BioLift Fitness<br />
                    Tax Category: Digital Services
                  </p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
};

export default BillingPayment;
