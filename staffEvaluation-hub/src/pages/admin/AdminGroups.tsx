import { useState, useMemo } from 'react';
import { useGroups, useStaff, useStaff2Groups, useOrganizationUnits, Group } from '@/hooks/useStaff';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Users, ChevronDown, ChevronRight, Building2 } from 'lucide-react';

export default function AdminGroups() {
  const { data: groups, isLoading } = useGroups();
  const { data: staff } = useStaff();
  const { data: staff2groups } = useStaff2Groups();
  const { data: units } = useOrganizationUnits();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [name, setName] = useState('');
  const [organizationunitid, setOrganizationunitid] = useState<string>('none');
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [expandedUnits, setExpandedUnits] = useState<Set<number>>(new Set());

  // Department (Khoa) dialog state
  const [isUnitDialogOpen, setIsUnitDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<{ id: number; name: string } | null>(null);
  const [unitName, setUnitName] = useState('');

  const groupedByUnit = useMemo(() => {
    if (!groups || !units) return [];

    const unitMap = new Map<number | null, Group[]>();

    groups.forEach(g => {
      const unitId = g.organizationunitid;
      if (!unitMap.has(unitId)) {
        unitMap.set(unitId, []);
      }
      unitMap.get(unitId)!.push(g);
    });

    const result: { unit: { id: number; name: string } | null; groups: Group[] }[] = [];

    units.forEach(unit => {
      const unitGroups = unitMap.get(unit.id) || [];
      result.push({ unit, groups: unitGroups });
    });

    const noUnitGroups = unitMap.get(null) || [];
    if (noUnitGroups.length > 0) {
      result.push({ unit: null, groups: noUnitGroups });
    }

    return result;
  }, [groups, units]);

  const toggleUnit = (unitId: number) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  const resetForm = () => {
    setName('');
    setOrganizationunitid('none');
    setEditingGroup(null);
  };

  const resetUnitForm = () => {
    setUnitName('');
    setEditingUnit(null);
  };

  const openEditDialog = (g: Group) => {
    setEditingGroup(g);
    setName(g.name);
    setOrganizationunitid(g.organizationunitid?.toString() || 'none');
    setIsDialogOpen(true);
  };

  const openMembersDialog = (g: Group) => {
    setSelectedGroup(g);
    const currentMembers = staff2groups?.filter(sg => sg.groupid === g.id).map(sg => sg.staffid) || [];
    setSelectedStaff(currentMembers);
    setIsMembersDialogOpen(true);
  };

  const openEditUnitDialog = (unit: { id: number; name: string }) => {
    setEditingUnit(unit);
    setUnitName(unit.name);
    setIsUnitDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      organizationunitid: organizationunitid && organizationunitid !== 'none' ? parseInt(organizationunitid) : null,
    };

    try {
      if (editingGroup) {
        await api.patch(`/groups/${editingGroup.id}`, payload);
        toast.success('Cập nhật thành công!');
      } else {
        await api.post('/groups', payload);
        toast.success('Thêm mới thành công!');
      }
      await queryClient.refetchQueries({ queryKey: queryKeys.groups });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Lỗi: ' + message);
    }
  };

  const handleUnitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUnit) {
        await api.patch(`/organization-units/${editingUnit.id}`, { name: unitName });
        toast.success('Cập nhật khoa thành công!');
      } else {
        await api.post('/organization-units', { name: unitName });
        toast.success('Thêm khoa thành công!');
      }
      await queryClient.refetchQueries({ queryKey: queryKeys.organizationUnits });
      await queryClient.refetchQueries({ queryKey: queryKeys.groups });
      setIsUnitDialogOpen(false);
      resetUnitForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Lỗi: ' + message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa nhóm này?')) return;

    try {
      await api.delete(`/groups/${id}`);
      toast.success('Đã xóa!');
      await queryClient.refetchQueries({ queryKey: queryKeys.groups });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Lỗi xóa: ' + message);
    }
  };

  const handleDeleteUnit = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa khoa này? Tất cả nhóm thuộc khoa này sẽ không còn thuộc khoa nào.')) return;

    try {
      await api.delete(`/organization-units/${id}`);
      toast.success('Đã xóa khoa!');
      await queryClient.refetchQueries({ queryKey: queryKeys.organizationUnits });
      await queryClient.refetchQueries({ queryKey: queryKeys.groups });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Lỗi xóa khoa: ' + message);
    }
  };

  const handleSaveMembers = async () => {
    if (!selectedGroup) return;

    try {
      await api.put(`/groups/${selectedGroup.id}/members`, {
        staffIds: selectedStaff,
      });
      toast.success('Cập nhật thành viên thành công!');
      await queryClient.refetchQueries({ queryKey: queryKeys.staff2groups });
      setIsMembersDialogOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Lỗi cập nhật thành viên: ' + message);
    }
  };

  const staffById = useMemo(() => {
    const map = new Map<number, string>();
    staff?.forEach(s => { if (s.name) map.set(s.id, s.name); });
    return map;
  }, [staff]);

  const groupMemberInfo = useMemo(() => {
    const map = new Map<number, { count: number; names: string[] }>();
    staff2groups?.forEach(sg => {
      if (!map.has(sg.groupid)) map.set(sg.groupid, { count: 0, names: [] });
      const info = map.get(sg.groupid)!;
      info.count++;
      const name = staffById.get(sg.staffid);
      if (name) info.names.push(name);
    });
    return map;
  }, [staff2groups, staffById]);

  const getMemberCount = (groupId: number) => {
    return groupMemberInfo.get(groupId)?.count || 0;
  };

  const getMemberNames = (groupId: number) => {
    return groupMemberInfo.get(groupId)?.names || [];
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
              <CardTitle>Quản lý Nhóm</CardTitle>
              <CardDescription>Danh sách {groups?.length || 0} nhóm đánh giá, phân theo khoa</CardDescription>
            </div>
            <div className="flex gap-2">
              {/* Add Department Button - Admin only */}
              {isAdmin && (
                <Dialog open={isUnitDialogOpen} onOpenChange={(open) => { setIsUnitDialogOpen(open); if (!open) resetUnitForm(); }}>
                  <DialogTrigger asChild>
                    <Button variant="outline"><Building2 className="mr-2 h-4 w-4" /> Thêm khoa</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingUnit ? 'Sửa khoa' : 'Thêm khoa'}</DialogTitle>
                      <DialogDescription>Nhập thông tin khoa</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUnitSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tên khoa</Label>
                        <Input value={unitName} onChange={e => setUnitName(e.target.value)} placeholder="Ví dụ: Khoa Công nghệ thông tin" required />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsUnitDialogOpen(false)}>Hủy</Button>
                        <Button type="submit">{editingUnit ? 'Cập nhật' : 'Thêm'}</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}

              {/* Add Group Button - Admin only */}
              {isAdmin && (
                <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                  <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" /> Thêm nhóm</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingGroup ? 'Sửa nhóm' : 'Thêm nhóm'}</DialogTitle>
                      <DialogDescription>Nhập thông tin nhóm</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tên nhóm</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Thuộc khoa</Label>
                        <Select value={organizationunitid} onValueChange={setOrganizationunitid}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn khoa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Không thuộc khoa nào</SelectItem>
                            {units?.map(u => (
                              <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                        <Button type="submit">{editingGroup ? 'Cập nhật' : 'Thêm'}</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {groupedByUnit.map(({ unit, groups: unitGroups }) => (
            <Collapsible
              key={unit?.id ?? 'no-unit'}
              open={unit ? expandedUnits.has(unit.id) : true}
              onOpenChange={() => unit && toggleUnit(unit.id)}
            >
              <Card className="border">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-3">
                    <div className="flex items-center gap-3">
                      {unit ? (
                        expandedUnits.has(unit.id) ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                      <Building2 className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <CardTitle className="text-base">
                          {unit?.name || 'Chưa phân khoa'}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {unitGroups.length} nhóm
                        </CardDescription>
                      </div>
                      {isAdmin && unit && (
                        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                          <Button size="icon" variant="ghost" onClick={() => openEditUnitDialog(unit)} aria-label="Sửa khoa">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteUnit(unit.id)} aria-label="Xóa khoa">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {unitGroups.length > 0 ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-16">ID</TableHead>
                              <TableHead>Tên nhóm</TableHead>
                              <TableHead>Thành viên</TableHead>
                              <TableHead className="w-32">Thao tác</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {unitGroups.map(g => (
                              <TableRow key={g.id}>
                                <TableCell className="font-mono">{g.id}</TableCell>
                                <TableCell className="font-medium">{g.name}</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    <Badge variant="secondary">{getMemberCount(g.id)} thành viên</Badge>
                                    {getMemberNames(g.id).slice(0, 2).map((name, i) => (
                                      <Badge key={i} variant="outline" className="text-xs">{name}</Badge>
                                    ))}
                                    {getMemberNames(g.id).length > 2 && (
                                      <Badge variant="outline" className="text-xs">+{getMemberNames(g.id).length - 2}</Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" onClick={() => openMembersDialog(g)} aria-label="Quản lý thành viên">
                                      <Users className="h-4 w-4" />
                                    </Button>
                                    {isAdmin && (
                                      <>
                                        <Button size="icon" variant="ghost" onClick={() => openEditDialog(g)} aria-label="Sửa nhóm">
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(g.id)} aria-label="Xóa nhóm">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground py-4 text-center">Chưa có nhóm nào trong khoa này</p>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}

          {groupedByUnit.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Chưa có nhóm nào</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isMembersDialogOpen} onOpenChange={setIsMembersDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thành viên nhóm</DialogTitle>
            <DialogDescription>{selectedGroup?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {staff?.map(s => (
              <div key={s.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted">
                <Checkbox
                  checked={selectedStaff.includes(s.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedStaff([...selectedStaff, s.id]);
                    } else {
                      setSelectedStaff(selectedStaff.filter(id => id !== s.id));
                    }
                  }}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.staffcode}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsMembersDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSaveMembers}>Lưu</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
