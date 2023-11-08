export class CommonResponseDto<T> {
    status: boolean
    statusCode: number
    message: string
    result?: T 
}