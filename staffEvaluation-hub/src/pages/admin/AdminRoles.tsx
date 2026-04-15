import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Shield, Loader2, UserPlus, Trash2 } from 'lucide-react';

interface UserWithRoles {
  id: string;
  email: string;
  roles: { id: string; role: string }[];
  profile?: {
    staffId: number | null;
    staff?: { name: string } | null;
  } | null;
}

export default function AdminRoles() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('user');

  const { data: users = [], isLoading } = useQuery({
    queryKey: queryKeys.usersRoles,
    queryFn: () => api.get<UserWithRoles[]>('/users/roles'),
  });

  const handleAddRole = async () => {
    if (!selectedUserId) return;

    try {
      await api.post(`/users/${selectedUserId}/roles`, { role: selectedRole });
      toast.success('Đã thêm quyền!');
      setIsDialogOpen(false);
      await queryClient.refetchQueries({ queryKey: queryKeys.usersRoles });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (message.includes('already')) {
        toast.error('Người dùng đã có quyền này');
      } else {
        toast.error('Lỗi: ' + message);
      }
    }
  };

  const handleRemoveRole = async (userId: string, role: string) => {
    if (!confirm('Bạn có chắc muốn xóa quyền này?')) return;

    try {
      await api.delete(`/users/${userId}/roles/${role}`);
      toast.success('Đã xóa quyền!');
      await queryClient.refetchQueries({ queryKey: queryKeys.usersRoles });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Lỗi: ' + message);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'moderator': return 'secondary';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Quản lý phân quyền
              </CardTitle>
              <CardDescription>Gán và quản lý quyền cho người dùng</CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Thêm quyền
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Giảng viên</TableHead>
                  <TableHead>Quyền hiện có</TableHead>
                  <TableHead className="w-24">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.filter(u => u.roles.length > 0).map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="text-sm">{u.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {u.profile?.staff?.name || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {u.roles.map(r => (
                          <Badge key={r.role} variant={getRoleBadgeVariant(r.role)}>
                            {r.role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {u.roles.map(r => (
                          <Button
                            key={r.role}
                            size="icon"
                            variant="ghost"
                            className="text-destructive h-7 w-7"
                            onClick={() => handleRemoveRole(u.id, r.role)}
                            aria-label={`Xóa quyền ${r.role}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {users.filter(u => u.roles.length > 0).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Chưa có phân quyền nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm quyền cho người dùng</DialogTitle>
            <DialogDescription>Chọn người dùng và quyền cần thêm</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Người dùng</label>
              <Select value={selectedUserId || ''} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn người dùng" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(u => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.email} {u.profile?.staff?.name ? `(${u.profile.staff.name})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quyền</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
              <Button onClick={handleAddRole} disabled={!selectedUserId}>Thêm quyền</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
