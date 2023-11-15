interface KakaoLogin {
  refreshToken: Promise<string>;
  accessToken: Promise<string>;
}
