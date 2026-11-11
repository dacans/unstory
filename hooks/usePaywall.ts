import { useState, useEffect } from 'react';
import Purchases, { PurchasesOfferings, CustomerInfo } from 'react-native-purchases';
import { useSessionStore } from '@/store/sessionStore';

const ENTITLEMENT_ID = 'Unstory Pro';
const PRODUCT_MONTHLY = 'premium_monthly_us';
const PRODUCT_ANNUAL = 'premium_annual_us';
const PRODUCT_LIFETIME = 'premium_lifetime_us';

export function usePaywall() {
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [isPremium, setIsPremiumState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setIsPremium = useSessionStore((s) => s.setIsPremium);

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      console.log('[RevenueCat] Fetching offerings...');
      const result = await Purchases.getOfferings();
      setOfferings(result);
      console.log('[RevenueCat] Offerings loaded:', result);

      const customerInfo: CustomerInfo = await Purchases.getCustomerInfo();
      const premium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      setIsPremiumState(premium);
      await setIsPremium(premium);
      console.log('[RevenueCat] isPremium:', premium);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load offerings';
      console.log('[RevenueCat] Error:', e);
      setError(msg);
    }
  };

  const purchaseProduct = async (productId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[RevenueCat] Purchase started:', productId);

      const packages = offerings?.current?.availablePackages ?? [];
      const pkg = packages.find((p) => p.product.identifier === productId);

      let customerInfo: CustomerInfo;
      if (pkg) {
        const result = await Purchases.purchasePackage(pkg);
        customerInfo = result.customerInfo;
      } else {
        // Fallback: purchase by product identifier directly
        const result = await Purchases.purchaseProduct(productId);
        customerInfo = result.customerInfo;
      }

      console.log('[RevenueCat] Purchase success:', customerInfo);
      const premium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      setIsPremiumState(premium);
      await setIsPremium(premium);
      console.log('[RevenueCat] isPremium:', premium);
    } catch (e: unknown) {
      const err = e as { userCancelled?: boolean; message?: string };
      if (!err.userCancelled) {
        const msg = err.message ?? 'Purchase failed';
        console.log('[RevenueCat] Error:', e);
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseMonthly = () => purchaseProduct(PRODUCT_MONTHLY);
  const purchaseAnnual = () => purchaseProduct(PRODUCT_ANNUAL);
  const purchaseLifetime = () => purchaseProduct(PRODUCT_LIFETIME);

  const restorePurchases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[RevenueCat] Restore started');
      const customerInfo: CustomerInfo = await Purchases.restorePurchases();
      console.log('[RevenueCat] Restore success:', customerInfo);

      const premium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      setIsPremiumState(premium);
      await setIsPremium(premium);
      console.log('[RevenueCat] isPremium:', premium);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Restore failed';
      console.log('[RevenueCat] Error:', e);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    offerings,
    isPremium,
    isLoading,
    purchaseMonthly,
    purchaseAnnual,
    purchaseLifetime,
    restorePurchases,
    error,
  };
}
