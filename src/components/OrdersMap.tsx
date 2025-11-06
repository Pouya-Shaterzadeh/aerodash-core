import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface DroneLocation {
  id: string;
  coordinates: [number, number];
  status: 'idle' | 'in-transit' | 'delivering';
}

interface OrdersMapProps {
  selectedOrder?: string;
  drones: DroneLocation[];
}

export const OrdersMap = ({ selectedOrder, drones }: OrdersMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-122.4194, 37.7749], // San Francisco
        zoom: 12,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add markers for drones
      drones.forEach((drone) => {
        const el = document.createElement('div');
        el.className = 'drone-marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = 
          drone.status === 'in-transit' ? 'hsl(var(--primary))' :
          drone.status === 'delivering' ? '#22c55e' :
          '#64748b';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        el.style.cursor = 'pointer';

        const marker = new mapboxgl.Marker(el)
          .setLngLat(drone.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<strong>Drone ${drone.id}</strong><br/>Status: ${drone.status}`)
          )
          .addTo(map.current!);

        markers.current.push(marker);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Map Error",
        description: "Failed to initialize map. Please check your Mapbox token.",
        variant: "destructive",
      });
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
    };
  }, [mapboxToken, drones, toast]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
        <Input
          id="mapbox-token"
          type="password"
          placeholder="Enter your Mapbox public token"
          value={mapboxToken}
          onChange={(e) => setMapboxToken(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Get your token at{' '}
          <a
            href="https://mapbox.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            mapbox.com
          </a>
        </p>
      </div>
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden border">
        <div ref={mapContainer} className="absolute inset-0" />
        {!mapboxToken && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/80 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">Enter Mapbox token to view map</p>
          </div>
        )}
      </div>
    </div>
  );
};
