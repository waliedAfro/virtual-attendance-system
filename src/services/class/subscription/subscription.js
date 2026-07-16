
const BillingCycle = {
    MONTHLY: 'MONTHLY',
    YEARLY: 'YEARLY'
};

const SubscriptionStatus = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED'
};

// Mock Data
const mockServices = [
    {
        serviceId: '1',
        name: 'CRM Pro',
        description: 'Complete customer relationship management',
        icon: '🏢',
        plans: [
            {
                planCode: 'BASIC',
                name: 'Basic',
                price: 29,
                billingCycle: BillingCycle.MONTHLY,
                isPopular: false,
                features: [
                    { name: 'Contact Management', included: true, limit: '500 contacts' },
                    { name: 'Email Integration', included: true, limit: '1000 emails/month' },
                    { name: 'Basic Reports', included: true, limit: null },
                    { name: 'API Access', included: false, limit: null },
                    { name: 'Custom Fields', included: false, limit: null }
                ]
            },
            {
                planCode: 'PRO',
                name: 'Professional',
                price: 79,
                billingCycle: BillingCycle.MONTHLY,
                isPopular: true,
                features: [
                    { name: 'Contact Management', included: true, limit: '2000 contacts' },
                    { name: 'Email Integration', included: true, limit: '5000 emails/month' },
                    { name: 'Advanced Reports', included: true, limit: null },
                    { name: 'API Access', included: true, limit: '1000 calls/day' },
                    { name: 'Custom Fields', included: true, limit: '20 fields' }
                ]
            },
            {
                planCode: 'ENTERPRISE',
                name: 'Enterprise',
                price: 199,
                billingCycle: BillingCycle.MONTHLY,
                isPopular: false,
                features: [
                    { name: 'Contact Management', included: true, limit: 'Unlimited' },
                    { name: 'Email Integration', included: true, limit: 'Unlimited' },
                    { name: 'Advanced Reports', included: true, limit: null },
                    { name: 'API Access', included: true, limit: 'Unlimited' },
                    { name: 'Custom Fields', included: true, limit: 'Unlimited' }
                ]
            }
        ]
    },
    {
        serviceId: '2',
        name: 'Analytics Suite',
        description: 'Powerful data analytics and visualization',
        icon: '📊',
        plans: [
            {
                planCode: 'BASIC',
                name: 'Basic',
                price: 49,
                billingCycle: BillingCycle.MONTHLY,
                isPopular: false,
                features: [
                    { name: 'Data Sources', included: true, limit: '2 sources' },
                    { name: 'Dashboards', included: true, limit: '3 dashboards' },
                    { name: 'Basic Visualizations', included: true, limit: null },
                    { name: 'Export Data', included: true, limit: 'CSV only' },
                    { name: 'Real-time Updates', included: false, limit: null }
                ]
            },
            {
                planCode: 'PRO',
                name: 'Professional',
                price: 99,
                billingCycle: BillingCycle.MONTHLY,
                isPopular: true,
                features: [
                    { name: 'Data Sources', included: true, limit: '5 sources' },
                    { name: 'Dashboards', included: true, limit: '10 dashboards' },
                    { name: 'Advanced Visualizations', included: true, limit: null },
                    { name: 'Export Data', included: true, limit: 'All formats' },
                    { name: 'Real-time Updates', included: true, limit: '5 min intervals' }
                ]
            }
        ]
    }
];

// Mock subscriptions
let mockSubscriptions = [
    {
        subscriptionId: 'sub1',
        tenantId: 'tenant-123',
        serviceId: '1',
        planCode: 'PRO',
        numberOfLicenses: 5,
        usedLicenses: 3,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
        billingCycle: BillingCycle.MONTHLY,
        renewalDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
        autoRenew: true,
        status: SubscriptionStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];