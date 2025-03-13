//-----Types.File-----
export interface LoginResultDto  {
  token?: string | null;
  refreshToken?: string | null;
}
export function deserializeLoginResultDto(json: string): LoginResultDto {
  const data = JSON.parse(json) as LoginResultDto;
  initLoginResultDto(data);
  return data;
}
export function initLoginResultDto(_data: LoginResultDto) {
    return _data;
}
export function serializeLoginResultDto(_data: LoginResultDto | undefined) {
  if (_data) {
    _data = prepareSerializeLoginResultDto(_data as LoginResultDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeLoginResultDto(_data: LoginResultDto): LoginResultDto {
  const data: Record<string, any> = { ..._data };
  return data as LoginResultDto;
}
export interface ProblemDetails  {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
}
export function deserializeProblemDetails(json: string): ProblemDetails {
  const data = JSON.parse(json) as ProblemDetails;
  initProblemDetails(data);
  return data;
}
export function initProblemDetails(_data: ProblemDetails) {
    return _data;
}
export function serializeProblemDetails(_data: ProblemDetails | undefined) {
  if (_data) {
    _data = prepareSerializeProblemDetails(_data as ProblemDetails);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeProblemDetails(_data: ProblemDetails): ProblemDetails {
  const data: Record<string, any> = { ..._data };
  return data as ProblemDetails;
}
export interface SessionDto  {
  id?: string;
  lastIp?: string | null;
  expiresAfter?: Date;
}
export function deserializeSessionDto(json: string): SessionDto {
  const data = JSON.parse(json) as SessionDto;
  initSessionDto(data);
  return data;
}
export function initSessionDto(_data: SessionDto) {
  if (_data) {
    _data.expiresAfter = _data["expiresAfter"] ? new Date(_data["expiresAfter"].toString()) : <any>null;
  }
  return _data;
}
export function serializeSessionDto(_data: SessionDto | undefined) {
  if (_data) {
    _data = prepareSerializeSessionDto(_data as SessionDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeSessionDto(_data: SessionDto): SessionDto {
  const data: Record<string, any> = { ..._data };
  data["expiresAfter"] = _data.expiresAfter && _data.expiresAfter.toISOString();
  return data as SessionDto;
}
export interface UserChangePasswordModel  {
  email: string;
  oldPassword: string;
  newPassword: string;
}
export function deserializeUserChangePasswordModel(json: string): UserChangePasswordModel {
  const data = JSON.parse(json) as UserChangePasswordModel;
  initUserChangePasswordModel(data);
  return data;
}
export function initUserChangePasswordModel(_data: UserChangePasswordModel) {
    return _data;
}
export function serializeUserChangePasswordModel(_data: UserChangePasswordModel | undefined) {
  if (_data) {
    _data = prepareSerializeUserChangePasswordModel(_data as UserChangePasswordModel);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeUserChangePasswordModel(_data: UserChangePasswordModel): UserChangePasswordModel {
  const data: Record<string, any> = { ..._data };
  return data as UserChangePasswordModel;
}
export interface UserDto  {
  id?: string;
  fullName?: string | null;
  email?: string | null;
  studentCardId?: string | null;
}
export function deserializeUserDto(json: string): UserDto {
  const data = JSON.parse(json) as UserDto;
  initUserDto(data);
  return data;
}
export function initUserDto(_data: UserDto) {
    return _data;
}
export function serializeUserDto(_data: UserDto | undefined) {
  if (_data) {
    _data = prepareSerializeUserDto(_data as UserDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeUserDto(_data: UserDto): UserDto {
  const data: Record<string, any> = { ..._data };
  return data as UserDto;
}
export interface UserEditProfileModel  {
  fullName: string;
}
export function deserializeUserEditProfileModel(json: string): UserEditProfileModel {
  const data = JSON.parse(json) as UserEditProfileModel;
  initUserEditProfileModel(data);
  return data;
}
export function initUserEditProfileModel(_data: UserEditProfileModel) {
    return _data;
}
export function serializeUserEditProfileModel(_data: UserEditProfileModel | undefined) {
  if (_data) {
    _data = prepareSerializeUserEditProfileModel(_data as UserEditProfileModel);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeUserEditProfileModel(_data: UserEditProfileModel): UserEditProfileModel {
  const data: Record<string, any> = { ..._data };
  return data as UserEditProfileModel;
}
export interface UserLoginModel  {
  email: string;
  password: string;
}
export function deserializeUserLoginModel(json: string): UserLoginModel {
  const data = JSON.parse(json) as UserLoginModel;
  initUserLoginModel(data);
  return data;
}
export function initUserLoginModel(_data: UserLoginModel) {
    return _data;
}
export function serializeUserLoginModel(_data: UserLoginModel | undefined) {
  if (_data) {
    _data = prepareSerializeUserLoginModel(_data as UserLoginModel);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeUserLoginModel(_data: UserLoginModel): UserLoginModel {
  const data: Record<string, any> = { ..._data };
  return data as UserLoginModel;
}
export interface UserRegisterModel  {
  fullName: string;
  email: string;
  password: string;
  studentIdNumber?: string | null;
}
export function deserializeUserRegisterModel(json: string): UserRegisterModel {
  const data = JSON.parse(json) as UserRegisterModel;
  initUserRegisterModel(data);
  return data;
}
export function initUserRegisterModel(_data: UserRegisterModel) {
    return _data;
}
export function serializeUserRegisterModel(_data: UserRegisterModel | undefined) {
  if (_data) {
    _data = prepareSerializeUserRegisterModel(_data as UserRegisterModel);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeUserRegisterModel(_data: UserRegisterModel): UserRegisterModel {
  const data: Record<string, any> = { ..._data };
  return data as UserRegisterModel;
}
import type { AxiosError } from 'axios'
export class ApiException extends Error {
    message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;
    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();
        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }
    protected isApiException = true;
    static isApiException(obj: any): obj is ApiException {
        return obj.isApiException === true;
    }
}
export function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
    if (result !== null && result !== undefined)
        throw result;
    else
        throw new ApiException(message, status, response, headers, null);
}
export function isAxiosError(obj: any | undefined): obj is AxiosError {
    return obj && obj.isAxiosError === true;
}
//-----/Types.File-----