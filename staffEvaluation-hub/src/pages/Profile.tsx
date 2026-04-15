import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStaff, useOrganizationUnits, Staff } from '@/hooks/useStaff';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/UserAvatar';
import { AVATAR_ACCEPT_ATTR, validateAvatarFile } from '@/lib/uploadLimits';
import { toast } from 'sonner';
import { User, Mail, Phone, Building, GraduationCap, Calendar, Save, Loader2, Camera } from 'lucide-react';

export default function Profile() {
  const { user, staffId } = useAuth();
  const { data: allStaff } = useStaff();
  const { data: units } = useOrganizationUnits();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    homeEmail: '',
    schoolEmail: '',
    mobile: '',
    birthday: '',
    academicrank: '',
    academicdegree: '',
    organizationunitid: '',
  });

  const currentStaff = allStaff?.find(s => s.id === staffId);

  useEffect(() => {
    if (currentStaff) {
      setFormData({
        name: currentStaff.name || '',
        homeEmail: currentStaff.homeEmail || '',
        schoolEmail: currentStaff.schoolEmail || '',
        mobile: currentStaff.mobile || '',
        birthday: currentStaff.birthday ? currentStaff.birthday.split('T')[0] : '',
        academicrank: currentStaff.academicrank || '',
        academicdegree: currentStaff.academicdegree || '',
        organizationunitid: currentStaff.organizationunitid?.toString() || '',
      });
    }
  }, [currentStaff]);

  const handleSave = useCallback(async () => {
    if (!staffId) return;

    setIsSaving(true);
    try {
      await api.patch(`/staff/${staffId}`, {
        name: formData.name || null,
        homeEmail: formData.homeEmail || null,
        schoolEmail: formData.schoolEmail || null,
        mobile: formData.mobile || null,
        birthday: formData.birthday || null,
        academicrank: formData.academicrank || null,
        academicdegree: formData.academicdegree || null,
        organizationunitid: formData.organizationunitid ? parseInt(formData.organizationunitid) : null,
      });

      toast.success('Cập nhật thành công!');
      setIsEditing(false);
      await queryClient.refetchQueries({ queryKey: queryKeys.staff });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Lỗi cập nhật: ' + message);
    } finally {
      setIsSaving(false);
    }
  }, [staffId, formData, queryClient]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !staffId) return;

    const validationError = validateAvatarFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUploadingAvatar(true);
    try {
      await api.uploadFile(`/staff/${staffId}/avatar`, file);
      toast.success('Cập nhật ảnh đại diện thành công!');
      await queryClient.refetchQueries({ queryKey: queryKeys.staff });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Lỗi tải ảnh: ' + message);
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getUnitName = (id: number | null) => {
    if (!id) return 'Chưa xác định';
    return units?.find(u => u.id === id)?.name || 'Chưa xác định';
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="relative group">
              <UserAvatar
                staff={currentStaff}
                fallbackText={user?.email}
                className="h-20 w-20 text-2xl"
              />
              {staffId && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  aria-label="Tải lên ảnh đại diện"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" aria-hidden="true" />
                  ) : (
                    <Camera className="h-6 w-6 text-white" aria-hidden="true" />
                  )}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={AVATAR_ACCEPT_ATTR}
                onChange={handleAvatarUpload}
                className="hidden"
                aria-hidden="true"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-serif font-bold">
                  {currentStaff?.name || 'Chưa cập nhật'}
                </h2>
                {currentStaff?.staffcode && (
                  <Badge variant="outline">{currentStaff.staffcode}</Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">
                {[currentStaff?.academicrank, currentStaff?.academicdegree].filter(Boolean).join(' - ') || 'Chưa cập nhật học hàm/học vị'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {getUnitName(currentStaff?.organizationunitid || null)}
              </p>
            </div>
            {staffId && (
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => {
                  if (isEditing && currentStaff) {
                    // Reset form data on cancel
                    setFormData({
                      name: currentStaff.name || '',
                      homeEmail: currentStaff.homeEmail || '',
                      schoolEmail: currentStaff.schoolEmail || '',
                      mobile: currentStaff.mobile || '',
                      birthday: currentStaff.birthday ? currentStaff.birthday.split('T')[0] : '',
                      academicrank: currentStaff.academicrank || '',
                      academicdegree: currentStaff.academicdegree || '',
                      organizationunitid: currentStaff.organizationunitid?.toString() || '',
                    });
                  }
                  setIsEditing(!isEditing);
                }}
              >
                {isEditing ? 'Hủy' : 'Chỉnh sửa'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin tài khoản
          </CardTitle>
          <CardDescription>Thông tin đăng nhập của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-muted-foreground text-sm">Email đăng nhập</Label>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Mã giảng viên</Label>
              <p className="font-medium">{currentStaff?.staffcode || 'Chưa liên kết'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      {staffId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Thông tin cá nhân
            </CardTitle>
            <CardDescription>Thông tin hồ sơ giảng viên</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Họ tên</Label>
                    <Input
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ngày sinh</Label>
                    <Input
                      type="date"
                      value={formData.birthday}
                      onChange={e => setFormData({...formData, birthday: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email cá nhân</Label>
                    <Input
                      type="email"
                      value={formData.homeEmail}
                      onChange={e => setFormData({...formData, homeEmail: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email trường</Label>
                    <Input
                      type="email"
                      value={formData.schoolEmail}
                      onChange={e => setFormData({...formData, schoolEmail: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Điện thoại</Label>
                    <Input
                      value={formData.mobile}
                      onChange={e => setFormData({...formData, mobile: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Đơn vị</Label>
                    <Select
                      value={formData.organizationunitid}
                      onValueChange={v => setFormData({...formData, organizationunitid: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đơn vị" />
                      </SelectTrigger>
                      <SelectContent>
                        {units?.map(u => (
                          <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Học hàm</Label>
                    <Input
                      value={formData.academicrank}
                      onChange={e => setFormData({...formData, academicrank: e.target.value})}
                      placeholder="PGS, GS..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Học vị</Label>
                    <Input
                      value={formData.academicdegree}
                      onChange={e => setFormData({...formData, academicdegree: e.target.value})}
                      placeholder="Thạc sỹ, Tiến sỹ..."
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-muted-foreground text-xs">Email cá nhân</Label>
                    <p className="font-medium">{currentStaff?.homeEmail || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-muted-foreground text-xs">Email trường</Label>
                    <p className="font-medium">{currentStaff?.schoolEmail || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-muted-foreground text-xs">Điện thoại</Label>
                    <p className="font-medium">{currentStaff?.mobile || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-muted-foreground text-xs">Ngày sinh</Label>
                    <p className="font-medium">{currentStaff?.birthday ? currentStaff.birthday.split('T')[0] : '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-muted-foreground text-xs">Đơn vị</Label>
                    <p className="font-medium">{getUnitName(currentStaff?.organizationunitid || null)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-muted-foreground text-xs">Học hàm / Học vị</Label>
                    <p className="font-medium">
                      {[currentStaff?.academicrank, currentStaff?.academicdegree].filter(Boolean).join(' / ') || '-'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!staffId && (
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-warning">
              <User className="h-5 w-5" />
              <div>
                <p className="font-medium">Tài khoản chưa được liên kết</p>
                <p className="text-sm text-muted-foreground">
                  Vui lòng liên hệ Admin để liên kết tài khoản với hồ sơ giảng viên.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
