export type ShopTabKey = 'top-brands' | 'nearby-stores' | 'marketplace';

export type ShopTab = {
  key: ShopTabKey;
  label: string;
};

export type Brand = {
  id: string;
  name: string;
  offer: string;
  initials: string;
};

export type Store = {
  id: string;
  name: string;
  address: string;
  initials: string;
};
