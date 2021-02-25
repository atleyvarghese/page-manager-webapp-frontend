export class Account {
  id: string;
  facebookId: string;
  name: string;
  extraInfo: string;
  token?: string;
}

export class Page {
  id: bigint;
  name: string;
  emails: string;
  website: string;
  about: string;
  phone: string;
}
