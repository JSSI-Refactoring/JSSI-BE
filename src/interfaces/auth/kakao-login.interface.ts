/** https://bobbyhadz.com/blog/typescript-property-does-not-exist-on-type */
export interface KakaoLogin {
  refreshToken: string | Promise<string>;
  accessToken: string | Promise<string>;
}

export interface RequestUserInfoToKaKao {
  userInfo: UserInfo;
}

interface UserInfo {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    profile_nickname_needs_agreement: boolean;
    profile_image_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url: string;
      profile_image_url: string;
      is_default_image: boolean;
    };
  };
}

export interface SelectOneUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: null | Date;
  socialId: string;
  socialType: 'KAKAO' | string;
  nickname: string;
  profileImage: string;
  OAuthRefreshToken: string;
  OAuthAccessToken: string;
  refreshToken: string;
  accessToken: string;
}

export interface SelectOneUserWithStatus {
  data: SelectOneUser;
  isNewUser: boolean;
}
