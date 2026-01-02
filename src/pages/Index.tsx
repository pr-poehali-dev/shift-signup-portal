import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type ShiftType = {
  id: string;
  name: string;
  time: string;
  color: string;
  icon: string;
  description: string;
};

const shiftTypes: ShiftType[] = [
  {
    id: 'morning',
    name: 'Утренняя смена',
    time: '06:00 - 14:00',
    color: 'from-amber-400 to-orange-500',
    icon: 'Sunrise',
    description: 'Ранний старт дня, идеально для жаворонков'
  },
  {
    id: 'day',
    name: 'Дневная смена',
    time: '09:00 - 18:00',
    color: 'from-yellow-400 to-amber-500',
    icon: 'Sun',
    description: 'Стандартный рабочий день'
  },
  {
    id: 'evening',
    name: 'Вечерняя смена',
    time: '14:00 - 22:00',
    color: 'from-purple-500 to-pink-600',
    icon: 'Sunset',
    description: 'Работа во второй половине дня'
  },
  {
    id: 'night',
    name: 'Ночная смена',
    time: '22:00 - 06:00',
    color: 'from-indigo-600 to-purple-700',
    icon: 'Moon',
    description: 'Ночное время, повышенная оплата'
  },
  {
    id: 'flexible',
    name: 'Гибкий график',
    time: 'По договорённости',
    color: 'from-teal-400 to-cyan-500',
    icon: 'Clock',
    description: 'Свободный выбор времени работы'
  }
];

type Employee = {
  id: number;
  name: string;
  position: string;
  department: string;
  status: 'available' | 'busy' | 'unavailable';
  initials: string;
};

type Shift = {
  id: number;
  date: string;
  shiftType: string;
  employee: string;
  position: string;
  status: 'confirmed' | 'pending' | 'completed';
};

const mockEmployees: Employee[] = [
  { id: 1, name: 'Анна Иванова', position: 'Менеджер', department: 'Продажи', status: 'available', initials: 'АИ' },
  { id: 2, name: 'Дмитрий Петров', position: 'Администратор', department: 'Поддержка', status: 'busy', initials: 'ДП' },
  { id: 3, name: 'Елена Смирнова', position: 'Менеджер', department: 'Продажи', status: 'available', initials: 'ЕС' },
  { id: 4, name: 'Игорь Козлов', position: 'Технический специалист', department: 'IT', status: 'unavailable', initials: 'ИК' },
  { id: 5, name: 'Мария Новикова', position: 'Менеджер', department: 'Продажи', status: 'available', initials: 'МН' },
  { id: 6, name: 'Олег Васильев', position: 'Администратор', department: 'Поддержка', status: 'available', initials: 'ОВ' },
];

const mockShifts: Shift[] = [
  { id: 1, date: '2026-01-03', shiftType: 'day', employee: 'Анна Иванова', position: 'Менеджер', status: 'confirmed' },
  { id: 2, date: '2026-01-03', shiftType: 'evening', employee: 'Дмитрий Петров', position: 'Администратор', status: 'pending' },
  { id: 3, date: '2026-01-04', shiftType: 'morning', employee: 'Елена Смирнова', position: 'Менеджер', status: 'confirmed' },
  { id: 4, date: '2026-01-04', shiftType: 'day', employee: 'Мария Новикова', position: 'Менеджер', status: 'confirmed' },
  { id: 5, date: '2026-01-05', shiftType: 'night', employee: 'Олег Васильев', position: 'Администратор', status: 'confirmed' },
];

const mockNotifications = [
  { id: 1, text: 'Новая смена назначена на 3 января', time: '10 мин назад', type: 'info' },
  { id: 2, text: 'Смена 2 января завершена', time: '2 часа назад', type: 'success' },
  { id: 3, text: 'Изменение в расписании на 5 января', time: 'вчера', type: 'warning' },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [positionFilter, setPositionFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedShiftType, setSelectedShiftType] = useState<string | null>(null);

  const filteredEmployees = mockEmployees.filter((emp) => {
    if (positionFilter !== 'all' && emp.position !== positionFilter) return false;
    if (departmentFilter !== 'all' && emp.department !== departmentFilter) return false;
    if (statusFilter !== 'all' && emp.status !== statusFilter) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'unavailable':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Доступен';
      case 'busy':
        return 'Занят';
      case 'unavailable':
        return 'Недоступен';
      case 'confirmed':
        return 'Подтверждена';
      case 'pending':
        return 'Ожидает';
      case 'completed':
        return 'Завершена';
      default:
        return status;
    }
  };

  const getShiftTypeData = (typeId: string) => {
    return shiftTypes.find(st => st.id === typeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="glass-effect sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Icon name="Calendar" className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ShiftSync
              </h1>
            </div>
            <nav className="hidden md:flex gap-2">
              {[
                { id: 'home', label: 'Главная', icon: 'Home' },
                { id: 'schedule', label: 'Расписание', icon: 'Calendar' },
                { id: 'employees', label: 'Сотрудники', icon: 'Users' },
                { id: 'my-shifts', label: 'Мои смены', icon: 'Clock' },
                { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  onClick={() => setActiveTab(tab.id)}
                  className={activeTab === tab.id ? 'gradient-primary text-white' : ''}
                >
                  <Icon name={tab.icon as any} size={18} />
                  <span className="ml-2">{tab.label}</span>
                </Button>
              ))}
            </nav>
            <Button variant="outline" className="rounded-full">
              <Icon name="User" size={20} />
              <span className="ml-2 hidden md:inline">Профиль</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Управление сменами стало проще
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Планируйте расписание, отслеживайте доступность сотрудников и управляйте сменами в одном месте
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover-lift border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <Icon name="Calendar" className="text-white" size={24} />
                  </div>
                  <CardTitle>Смены на сегодня</CardTitle>
                  <CardDescription>Активных смен</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    8
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-4">
                    <Icon name="Users" className="text-white" size={24} />
                  </div>
                  <CardTitle>Доступно сотрудников</CardTitle>
                  <CardDescription>Готовы к работе</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    12
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center mb-4">
                    <Icon name="Bell" className="text-white" size={24} />
                  </div>
                  <CardTitle>Уведомления</CardTitle>
                  <CardDescription>Новых сообщений</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                    3
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Clock" size={24} />
                  Типы смен
                </CardTitle>
                <CardDescription>Выберите подходящий график работы</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shiftTypes.map((shift) => (
                    <div
                      key={shift.id}
                      className="group relative p-6 rounded-2xl border-2 hover-lift cursor-pointer transition-all"
                      onClick={() => setSelectedShiftType(shift.id)}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${shift.color} opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity`} />
                      <div className="relative">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${shift.color} flex items-center justify-center mb-4`}>
                          <Icon name={shift.icon as any} className="text-white" size={28} />
                        </div>
                        <h3 className="font-bold text-lg mb-1">{shift.name}</h3>
                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                          {shift.time}
                        </p>
                        <p className="text-sm text-muted-foreground">{shift.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={24} />
                  Ближайшие смены
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockShifts.slice(0, 3).map((shift) => {
                    const shiftData = getShiftTypeData(shift.shiftType);
                    return (
                      <div
                        key={shift.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border hover-lift"
                      >
                        <div className="flex items-center gap-4">
                          {shiftData && (
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${shiftData.color} flex items-center justify-center`}>
                              <Icon name={shiftData.icon as any} className="text-white" size={20} />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-lg">{shift.employee}</div>
                            <div className="text-sm text-muted-foreground">
                              {shift.date} • {shiftData?.time}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(shift.status)}>{getStatusText(shift.status)}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Расписание смен</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gradient-primary text-white">
                    <Icon name="Plus" size={20} />
                    <span className="ml-2">Добавить смену</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Выберите тип смены</DialogTitle>
                    <DialogDescription>Укажите время работы для новой смены</DialogDescription>
                  </DialogHeader>
                  <div className="grid md:grid-cols-2 gap-4 py-4">
                    {shiftTypes.map((shift) => (
                      <div
                        key={shift.id}
                        className="group relative p-6 rounded-2xl border-2 hover-lift cursor-pointer transition-all"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${shift.color} opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity`} />
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${shift.color} flex items-center justify-center mb-3`}>
                            <Icon name={shift.icon as any} className="text-white" size={24} />
                          </div>
                          <h3 className="font-bold text-base mb-1">{shift.name}</h3>
                          <p className="text-xl font-bold text-primary mb-1">{shift.time}</p>
                          <p className="text-sm text-muted-foreground">{shift.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs defaultValue="week" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="day">День</TabsTrigger>
                <TabsTrigger value="week">Неделя</TabsTrigger>
                <TabsTrigger value="month">Месяц</TabsTrigger>
              </TabsList>
              <TabsContent value="week" className="space-y-4 mt-6">
                {mockShifts.map((shift) => {
                  const shiftData = getShiftTypeData(shift.shiftType);
                  return (
                    <Card key={shift.id} className="hover-lift">
                      <CardContent className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-primary">
                              {new Date(shift.date).getDate()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(shift.date).toLocaleDateString('ru', { month: 'short' })}
                            </div>
                          </div>
                          <div className="h-16 w-px bg-border" />
                          {shiftData && (
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${shiftData.color} flex items-center justify-center`}>
                              <Icon name={shiftData.icon as any} className="text-white" size={20} />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-lg">{shift.employee}</div>
                            <div className="text-sm text-muted-foreground">{shift.position}</div>
                            <div className="text-sm font-medium text-primary mt-1">
                              {shiftData?.name} • {shiftData?.time}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(shift.status)}>{getStatusText(shift.status)}</Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Сотрудники</h2>
              <Button className="gradient-primary text-white">
                <Icon name="UserPlus" size={20} />
                <span className="ml-2">Добавить сотрудника</span>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Filter" size={20} />
                  Фильтры
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Должность</label>
                    <Select value={positionFilter} onValueChange={setPositionFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Все должности" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все должности</SelectItem>
                        <SelectItem value="Менеджер">Менеджер</SelectItem>
                        <SelectItem value="Администратор">Администратор</SelectItem>
                        <SelectItem value="Технический специалист">Технический специалист</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Отдел</label>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Все отделы" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все отделы</SelectItem>
                        <SelectItem value="Продажи">Продажи</SelectItem>
                        <SelectItem value="Поддержка">Поддержка</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Доступность</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Все статусы" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все статусы</SelectItem>
                        <SelectItem value="available">Доступен</SelectItem>
                        <SelectItem value="busy">Занят</SelectItem>
                        <SelectItem value="unavailable">Недоступен</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Avatar className="w-16 h-16 gradient-primary">
                        <AvatarFallback className="text-white text-xl font-bold">
                          {employee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <Badge className={getStatusColor(employee.status)}>{getStatusText(employee.status)}</Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{employee.position}</p>
                    <p className="text-sm text-primary font-medium mb-4">{employee.department}</p>
                    <Button variant="outline" className="w-full">
                      <Icon name="CalendarPlus" size={18} />
                      <span className="ml-2">Записать на смену</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'my-shifts' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold">Мои смены</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Clock" size={20} />
                    Предстоящие смены
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockShifts.slice(0, 3).map((shift) => {
                    const shiftData = getShiftTypeData(shift.shiftType);
                    return (
                      <div key={shift.id} className="p-4 rounded-xl border hover-lift">
                        <div className="flex items-center gap-3 mb-2">
                          {shiftData && (
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${shiftData.color} flex items-center justify-center`}>
                              <Icon name={shiftData.icon as any} className="text-white" size={18} />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold">{shiftData?.name}</div>
                            <div className="text-sm text-primary font-medium">{shiftData?.time}</div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{shift.date}</div>
                        <div className="text-sm font-medium mt-1">{shift.position}</div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="CheckCircle" size={20} />
                    Завершённые смены
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                      24
                    </div>
                    <p className="text-muted-foreground">смены за этот месяц</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold">Уведомления</h2>
            <Card>
              <CardContent className="p-0">
                {mockNotifications.map((notif, idx) => (
                  <div
                    key={notif.id}
                    className={`p-6 flex items-start gap-4 hover:bg-muted/50 transition-colors ${
                      idx !== mockNotifications.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        notif.type === 'info'
                          ? 'bg-blue-100'
                          : notif.type === 'success'
                          ? 'bg-green-100'
                          : 'bg-orange-100'
                      }`}
                    >
                      <Icon
                        name={notif.type === 'info' ? 'Info' : notif.type === 'success' ? 'CheckCircle' : 'AlertCircle'}
                        size={20}
                        className={
                          notif.type === 'info'
                            ? 'text-blue-600'
                            : notif.type === 'success'
                            ? 'text-green-600'
                            : 'text-orange-600'
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{notif.text}</p>
                      <p className="text-sm text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
