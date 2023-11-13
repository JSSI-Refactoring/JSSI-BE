import { CommonResponseDto } from 'src/common/dto/reponse.dto';

export class KakaoLoginResponseDto extends CommonResponseDto<string> {
  accessToken: string;
}
