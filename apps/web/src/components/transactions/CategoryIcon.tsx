import React from 'react';
import {
    Briefcase, Laptop, Building, TrendingUp, Home, Gift, PieChart, RefreshCcw, PlusCircle, // Income
    Zap, Droplet, Flame, Wifi, Smartphone, PenTool as Tool, Sofa, // Housing
    Fuel, Bus, MapPin, Ticket, Car, // Transport
    ShoppingCart, Utensils, Coffee, Wine, // Food
    Book, GraduationCap, BookOpen, Pen, // Education
    ShoppingBag, Shirt, Film, Repeat, Activity, Plane, Smile, Heart, Pill, Dog, Baby, HeartHandshake, // Lifestyle
    Shield, FileText, AlertCircle, CreditCard, AlertTriangle, ArrowRightLeft, Tag // Financial
} from 'lucide-react';
import { cn } from '@/utils/cn';

const iconMap: Record<string, any> = {
    'briefcase': Briefcase,
    'laptop': Laptop,
    'building': Building,
    'trending-up': TrendingUp,
    'home': Home,
    'gift': Gift,
    'pie-chart': PieChart,
    'refresh-ccw': RefreshCcw,
    'plus-circle': PlusCircle,
    'zap': Zap,
    'droplet': Droplet,
    'flame': Flame,
    'wifi': Wifi,
    'smartphone': Smartphone,
    'tool': Tool,
    'sofa': Sofa,
    'fuel': Fuel,
    'bus': Bus,
    'map-pin': MapPin,
    'ticket': Ticket,
    'car': Car,
    'shopping-cart': ShoppingCart,
    'utensils': Utensils,
    'coffee': Coffee,
    'wine': Wine,
    'book': Book,
    'graduation-cap': GraduationCap,
    'book-open': BookOpen,
    'pencil': Pen,
    'shopping-bag': ShoppingBag,
    'shirt': Shirt,
    'film': Film,
    'repeat': Repeat,
    'activity': Activity,
    'plane': Plane,
    'smile': Smile,
    'heart': Heart,
    'pill': Pill,
    'dog': Dog,
    'baby': Baby,
    'heart-handshake': HeartHandshake,
    'shield': Shield,
    'file-text': FileText,
    'alert-circle': AlertCircle,
    'credit-card': CreditCard,
    'alert-triangle': AlertTriangle,
    'arrow-right-left': ArrowRightLeft
};

interface CategoryIconProps {
    iconName?: string;
    color?: string;
    size?: number;
    className?: string;
}

export function CategoryIcon({ iconName, color, size = 20, className }: CategoryIconProps) {
    const Icon = iconName ? iconMap[iconName] : Tag;
    const TagIcon = iconMap['tag'] || Ticket; // Fallback

    if (!Icon) return <TagIcon size={size} className={cn("text-gray-400", className)} />;

    return <Icon size={size} color={color} className={className} style={{ color: color }} />;
}
