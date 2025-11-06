import { DashboardLayout } from "@/components/DashboardLayout";
import { OrdersMap } from "@/components/OrdersMap";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Clock, Package } from "lucide-react";
import { useState } from "react";

type OrderStatus = 'pending' | 'in-transit' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  customer: string;
  destination: string;
  droneId: string;
  status: OrderStatus;
  estimatedTime: string;
  distance: string;
  priority: 'high' | 'medium' | 'low';
}

const mockOrders: Order[] = [
  {
    id: 'ORD-8392',
    customer: 'Sarah Johnson',
    destination: '123 Market St, SF',
    droneId: 'DX-042',
    status: 'in-transit',
    estimatedTime: '15 min',
    distance: '3.2 km',
    priority: 'high',
  },
  {
    id: 'ORD-8391',
    customer: 'Michael Chen',
    destination: '456 Mission Blvd',
    droneId: 'DX-038',
    status: 'pending',
    estimatedTime: '25 min',
    distance: '5.8 km',
    priority: 'medium',
  },
  {
    id: 'ORD-8390',
    customer: 'Emma Davis',
    destination: '789 Valencia St',
    droneId: 'DX-051',
    status: 'delivered',
    estimatedTime: 'Completed',
    distance: '2.1 km',
    priority: 'low',
  },
  {
    id: 'ORD-8389',
    customer: 'James Wilson',
    destination: '321 Broadway Ave',
    droneId: 'DX-029',
    status: 'in-transit',
    estimatedTime: '8 min',
    distance: '1.5 km',
    priority: 'high',
  },
  {
    id: 'ORD-8388',
    customer: 'Olivia Brown',
    destination: '654 Castro St',
    droneId: 'DX-015',
    status: 'delivered',
    estimatedTime: 'Completed',
    distance: '4.3 km',
    priority: 'medium',
  },
];

const mockDrones = [
  { id: 'DX-042', coordinates: [-122.4094, 37.7849] as [number, number], status: 'in-transit' as const },
  { id: 'DX-038', coordinates: [-122.4294, 37.7649] as [number, number], status: 'idle' as const },
  { id: 'DX-051', coordinates: [-122.4194, 37.7749] as [number, number], status: 'delivering' as const },
  { id: 'DX-029', coordinates: [-122.3994, 37.7949] as [number, number], status: 'in-transit' as const },
];

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<string>();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockOrders.length,
    inTransit: mockOrders.filter(o => o.status === 'in-transit').length,
    pending: mockOrders.filter(o => o.status === 'pending').length,
    delivered: mockOrders.filter(o => o.status === 'delivered').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Order Tracking</h2>
          <p className="text-muted-foreground mt-2">
            Real-time drone delivery monitoring and management
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Transit</CardTitle>
              <MapPin className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.inTransit}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.delivered}</div>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle>Live Drone Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersMap selectedOrder={selectedOrder} drones={mockDrones} />
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Active Orders</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Drone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow 
                      key={order.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedOrder(order.id)}
                    >
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{order.destination}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {order.droneId}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>{order.estimatedTime}</TableCell>
                      <TableCell>{order.distance}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            order.priority === 'high' 
                              ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                              : order.priority === 'medium'
                              ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                              : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                          }
                        >
                          {order.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
