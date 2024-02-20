export interface localUserDetails {
    user_id?: number;
    access_token?: string;
  }

export class UserDetails {
    device_reg_id?: string;
    email?: string;
    emailVerified?: boolean;
    first_name?: string;
    id?: number;
    last_name?: string;
    phone_number?: string;
    points?: number;
    realm?: number;
    referred_source?:string;
    role?: string;
    username?: string;
  }