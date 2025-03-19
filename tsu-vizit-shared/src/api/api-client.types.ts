//-----Types.File-----
export enum AbsenceReason {
    Personal = "Personal",
    Family = "Family",
    Sick = "Sick",
}
export interface AbsenceRequestDto  {
  id?: string;
  absencePeriodStart?: Date;
  absencePeriodFinish?: Date;
  timeCreated?: Date;
  timeFinalised?: Date;
  createdById?: string;
  finalisedById?: string | null;
  finalStatus?: AbsenceRequestResult;
  reason?: AbsenceReason;
  attachments?: DocumentDto[] | null;
}
export function deserializeAbsenceRequestDto(json: string): AbsenceRequestDto {
  const data = JSON.parse(json) as AbsenceRequestDto;
  initAbsenceRequestDto(data);
  return data;
}
export function initAbsenceRequestDto(_data: AbsenceRequestDto) {
  if (_data) {
    _data.absencePeriodStart = _data["absencePeriodStart"] ? parseDateOnly(_data["absencePeriodStart"].toString()) : <any>null;
    _data.absencePeriodFinish = _data["absencePeriodFinish"] ? parseDateOnly(_data["absencePeriodFinish"].toString()) : <any>null;
    _data.timeCreated = _data["timeCreated"] ? new Date(_data["timeCreated"].toString()) : <any>null;
    _data.timeFinalised = _data["timeFinalised"] ? new Date(_data["timeFinalised"].toString()) : <any>null;
    _data.finalStatus = _data["finalStatus"];
    _data.reason = _data["reason"];
    if (Array.isArray(_data["attachments"])) {
      _data.attachments = _data["attachments"].map(item => 
        initDocumentDto(item)
      );
    }
  }
  return _data;
}
export function serializeAbsenceRequestDto(_data: AbsenceRequestDto | undefined) {
  if (_data) {
    _data = prepareSerializeAbsenceRequestDto(_data as AbsenceRequestDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeAbsenceRequestDto(_data: AbsenceRequestDto): AbsenceRequestDto {
  const data: Record<string, any> = { ..._data };
  data["absencePeriodStart"] = _data.absencePeriodStart && formatDate(_data.absencePeriodStart);
  data["absencePeriodFinish"] = _data.absencePeriodFinish && formatDate(_data.absencePeriodFinish);
  data["timeCreated"] = _data.timeCreated && _data.timeCreated.toISOString();
  data["timeFinalised"] = _data.timeFinalised && _data.timeFinalised.toISOString();
  if (Array.isArray(_data.attachments)) {
    data["attachments"] = _data.attachments.map(item => 
        prepareSerializeDocumentDto(item)
    );
  }
  return data as AbsenceRequestDto;
}
export enum AbsenceRequestResult {
    Unknown = "Unknown",
    Approved = "Approved",
    Declined = "Declined",
}
export enum AbsenceRequestSorting {
    TimeCreatedAsc = "TimeCreatedAsc",
    TimeCreatedDesc = "TimeCreatedDesc",
    TimeFinalisedAsc = "TimeFinalisedAsc",
    TimeFinalisedDesc = "TimeFinalisedDesc",
}
export interface CreateAbsenceRequestModel  {
  absencePeriodStart: Date;
  absencePeriodFinish: Date;
  reason: AbsenceReason;
}
export function deserializeCreateAbsenceRequestModel(json: string): CreateAbsenceRequestModel {
  const data = JSON.parse(json) as CreateAbsenceRequestModel;
  initCreateAbsenceRequestModel(data);
  return data;
}
export function initCreateAbsenceRequestModel(_data: CreateAbsenceRequestModel) {
  if (_data) {
    _data.absencePeriodStart = _data["absencePeriodStart"] ? parseDateOnly(_data["absencePeriodStart"].toString()) : <any>null;
    _data.absencePeriodFinish = _data["absencePeriodFinish"] ? parseDateOnly(_data["absencePeriodFinish"].toString()) : <any>null;
    _data.reason = _data["reason"];
  }
  return _data;
}
export function serializeCreateAbsenceRequestModel(_data: CreateAbsenceRequestModel | undefined) {
  if (_data) {
    _data = prepareSerializeCreateAbsenceRequestModel(_data as CreateAbsenceRequestModel);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeCreateAbsenceRequestModel(_data: CreateAbsenceRequestModel): CreateAbsenceRequestModel {
  const data: Record<string, any> = { ..._data };
  data["absencePeriodStart"] = _data.absencePeriodStart && formatDate(_data.absencePeriodStart);
  data["absencePeriodFinish"] = _data.absencePeriodFinish && formatDate(_data.absencePeriodFinish);
  return data as CreateAbsenceRequestModel;
}
export interface Document  {
  id?: string;
  absenceRequestId?: string;
  attachment?: string | null;
}
export function deserializeDocument(json: string): Document {
  const data = JSON.parse(json) as Document;
  initDocument(data);
  return data;
}
export function initDocument(_data: Document) {
    return _data;
}
export function serializeDocument(_data: Document | undefined) {
  if (_data) {
    _data = prepareSerializeDocument(_data as Document);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeDocument(_data: Document): Document {
  const data: Record<string, any> = { ..._data };
  return data as Document;
}
export interface DocumentDto  {
  id?: string;
}
export function deserializeDocumentDto(json: string): DocumentDto {
  const data = JSON.parse(json) as DocumentDto;
  initDocumentDto(data);
  return data;
}
export function initDocumentDto(_data: DocumentDto) {
    return _data;
}
export function serializeDocumentDto(_data: DocumentDto | undefined) {
  if (_data) {
    _data = prepareSerializeDocumentDto(_data as DocumentDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeDocumentDto(_data: DocumentDto): DocumentDto {
  const data: Record<string, any> = { ..._data };
  return data as DocumentDto;
}
export interface EditAbsenceRequestModel  {
  absencePeriodStart: Date;
  absencePeriodFinish: Date;
  reason: AbsenceReason;
}
export function deserializeEditAbsenceRequestModel(json: string): EditAbsenceRequestModel {
  const data = JSON.parse(json) as EditAbsenceRequestModel;
  initEditAbsenceRequestModel(data);
  return data;
}
export function initEditAbsenceRequestModel(_data: EditAbsenceRequestModel) {
  if (_data) {
    _data.absencePeriodStart = _data["absencePeriodStart"] ? parseDateOnly(_data["absencePeriodStart"].toString()) : <any>null;
    _data.absencePeriodFinish = _data["absencePeriodFinish"] ? parseDateOnly(_data["absencePeriodFinish"].toString()) : <any>null;
    _data.reason = _data["reason"];
  }
  return _data;
}
export function serializeEditAbsenceRequestModel(_data: EditAbsenceRequestModel | undefined) {
  if (_data) {
    _data = prepareSerializeEditAbsenceRequestModel(_data as EditAbsenceRequestModel);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeEditAbsenceRequestModel(_data: EditAbsenceRequestModel): EditAbsenceRequestModel {
  const data: Record<string, any> = { ..._data };
  data["absencePeriodStart"] = _data.absencePeriodStart && formatDate(_data.absencePeriodStart);
  data["absencePeriodFinish"] = _data.absencePeriodFinish && formatDate(_data.absencePeriodFinish);
  return data as EditAbsenceRequestModel;
}
export interface EditAbsenceRequestStatusDto  {
  status: AbsenceRequestResult;
}
export function deserializeEditAbsenceRequestStatusDto(json: string): EditAbsenceRequestStatusDto {
  const data = JSON.parse(json) as EditAbsenceRequestStatusDto;
  initEditAbsenceRequestStatusDto(data);
  return data;
}
export function initEditAbsenceRequestStatusDto(_data: EditAbsenceRequestStatusDto) {
  if (_data) {
    _data.status = _data["status"];
  }
  return _data;
}
export function serializeEditAbsenceRequestStatusDto(_data: EditAbsenceRequestStatusDto | undefined) {
  if (_data) {
    _data = prepareSerializeEditAbsenceRequestStatusDto(_data as EditAbsenceRequestStatusDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeEditAbsenceRequestStatusDto(_data: EditAbsenceRequestStatusDto): EditAbsenceRequestStatusDto {
  const data: Record<string, any> = { ..._data };
  return data as EditAbsenceRequestStatusDto;
}
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
  role?: UserRole;
}
export function deserializeUserDto(json: string): UserDto {
  const data = JSON.parse(json) as UserDto;
  initUserDto(data);
  return data;
}
export function initUserDto(_data: UserDto) {
  if (_data) {
    _data.role = _data["role"];
  }
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
  email: string;
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
export interface UserPermissionsDto  {
  canCreate?: boolean;
  canCheck?: boolean;
  canApprove?: boolean;
  isAdmin?: boolean;
  canExportAll?: boolean;
}
export function deserializeUserPermissionsDto(json: string): UserPermissionsDto {
  const data = JSON.parse(json) as UserPermissionsDto;
  initUserPermissionsDto(data);
  return data;
}
export function initUserPermissionsDto(_data: UserPermissionsDto) {
    return _data;
}
export function serializeUserPermissionsDto(_data: UserPermissionsDto | undefined) {
  if (_data) {
    _data = prepareSerializeUserPermissionsDto(_data as UserPermissionsDto);
  }
  return JSON.stringify(_data);
}
export function prepareSerializeUserPermissionsDto(_data: UserPermissionsDto): UserPermissionsDto {
  const data: Record<string, any> = { ..._data };
  return data as UserPermissionsDto;
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
export enum UserRole {
    Student = "Student",
    Teacher = "Teacher",
    DeansEmployee = "DeansEmployee",
    Admin = "Admin",
}
export enum UserSorting {
    NameAsc = "NameAsc",
    NameDesc = "NameDesc",
    RoleAsc = "RoleAsc",
    RoleDesc = "RoleDesc",
}
export function formatDate(d: Date) {
    return d.getFullYear() + '-' + 
        (d.getMonth() < 9 ? ('0' + (d.getMonth()+1)) : (d.getMonth()+1)) + '-' +
        (d.getDate() < 10 ? ('0' + d.getDate()) : d.getDate());
}
export function parseDateOnly(s: string) {
    const date = new Date(s);
    return new Date(date.getTime() + 
        date.getTimezoneOffset() * 60000);
}
import type { AxiosError } from 'axios'
export interface FileParameter {
    data: any;
    fileName: string;
}
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