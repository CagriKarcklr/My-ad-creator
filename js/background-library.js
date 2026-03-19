/**
 * Background Library — Comprehensive background collection for social media posts
 * 100+ gradients, canvas-generated patterns, stock photos, and custom upload
 */

window.BackgroundLibrary = (() => {
  'use strict';

  // ==================== GRADIENT BACKGROUNDS ====================
  // Organized by mood/category with diverse options

  const GRADIENTS = {

    // ===== SPENDAILY BRAND =====
    brand: [
      { id: 'brand-1', name: 'Spendaily Classic', colors: ['#5B9BD5', '#8B6DB5', '#D4779C'], angle: 180 },
      { id: 'brand-2', name: 'Spendaily Soft', colors: ['#B8A9D9', '#D4B8E0', '#F0C8D8'], angle: 160 },
      { id: 'brand-3', name: 'Spendaily Dawn', colors: ['#C8A2D4', '#E8B4C8', '#F5D0B0'], angle: 135 },
      { id: 'brand-4', name: 'Spendaily Dusk', colors: ['#4A6FA5', '#7B5EA7', '#B86B8A'], angle: 200 },
      { id: 'brand-5', name: 'Spendaily Mist', colors: ['#D6CFEE', '#EAD4E6', '#F5E6DA'], angle: 180 },
      { id: 'brand-6', name: 'Lavender Fields', colors: ['#9B8EC4', '#C4A8D4', '#E8C8D8'], angle: 150 },
      { id: 'brand-7', name: 'Violet Hour', colors: ['#7B68AE', '#A888C4', '#D4A0B8'], angle: 170 },
      { id: 'brand-8', name: 'Plum Blossom', colors: ['#8E6BAF', '#C490B5', '#E8B8C4'], angle: 140 },
      { id: 'brand-9', name: 'Iris Bloom', colors: ['#6B5CA5', '#9B7BBF', '#CDA4CF'], angle: 180 },
      { id: 'brand-10', name: 'Twilight Zone', colors: ['#3D3472', '#6B5CA5', '#A888C4', '#D4B8E0'], angle: 180 },
      { id: 'brand-11', name: 'Purple Rain', colors: ['#5B3A8C', '#8B5FC7', '#C084FC'], angle: 135 },
      { id: 'brand-12', name: 'Amethyst', colors: ['#9B59B6', '#C39BD3', '#E8D5F5'], angle: 180 },
      { id: 'brand-13', name: 'Lilac Haze', colors: ['#C8B6FF', '#E2D1F9', '#FFE6F0'], angle: 160 },
      { id: 'brand-14', name: 'Grape Soda', colors: ['#6C3483', '#A569BD', '#D7BDE2'], angle: 145 },
      { id: 'brand-15', name: 'Wisteria', colors: ['#8E44AD', '#BB8FCE', '#EBDEF0'], angle: 170 },
    ],

    // ===== PASTEL DREAMS =====
    pastel: [
      { id: 'pastel-1', name: 'Cotton Candy', colors: ['#FFDEE9', '#B5FFFC'], angle: 135 },
      { id: 'pastel-2', name: 'Baby Blue', colors: ['#E0C3FC', '#8EC5FC'], angle: 135 },
      { id: 'pastel-3', name: 'Peach Cloud', colors: ['#FFECD2', '#FCB69F'], angle: 135 },
      { id: 'pastel-4', name: 'Mint Fresh', colors: ['#A8EDEA', '#FED6E3'], angle: 135 },
      { id: 'pastel-5', name: 'Rose Quartz', colors: ['#FECFEF', '#FF9A9E'], angle: 180 },
      { id: 'pastel-6', name: 'Serenity', colors: ['#89CFF0', '#CDB4DB', '#FFC8DD'], angle: 135 },
      { id: 'pastel-7', name: 'Sherbet', colors: ['#F7C5A8', '#FAE3D9', '#BBDED6'], angle: 135 },
      { id: 'pastel-8', name: 'Macaron', colors: ['#FFE5EC', '#FFC2D1', '#FFB3C6'], angle: 180 },
      { id: 'pastel-9', name: 'Cloud Nine', colors: ['#DBEAFE', '#E8D5F5', '#FCE7F3'], angle: 160 },
      { id: 'pastel-10', name: 'Lemon Sorbet', colors: ['#FFF3BF', '#FFE0B2', '#FFCCBC'], angle: 135 },
      { id: 'pastel-11', name: 'Fairy Dust', colors: ['#E8D5F5', '#D0E8F2', '#E8F5E9'], angle: 135 },
      { id: 'pastel-12', name: 'Blush Pink', colors: ['#FEC8D8', '#FFDFD3'], angle: 180 },
      { id: 'pastel-13', name: 'Aqua Mint', colors: ['#B2F5EA', '#C4F0FC', '#E8D5F5'], angle: 135 },
      { id: 'pastel-14', name: 'Vanilla Sky', colors: ['#FFF8DC', '#FAEBD7', '#FFE4E1'], angle: 180 },
      { id: 'pastel-15', name: 'Candy Floss', colors: ['#FFB6C1', '#DDA0DD', '#B0E0E6'], angle: 135 },
    ],

    // ===== BOLD & VIBRANT =====
    bold: [
      { id: 'bold-1', name: 'Electric', colors: ['#FC466B', '#3F5EFB'], angle: 135 },
      { id: 'bold-2', name: 'Neon Pulse', colors: ['#FF0844', '#FFB199'], angle: 135 },
      { id: 'bold-3', name: 'Citrus Burst', colors: ['#F7971E', '#FFD200'], angle: 135 },
      { id: 'bold-4', name: 'Ocean Drive', colors: ['#00C9FF', '#92FE9D'], angle: 135 },
      { id: 'bold-5', name: 'Hot Pink', colors: ['#FF006E', '#FF4CC9'], angle: 135 },
      { id: 'bold-6', name: 'Sunset Blvd', colors: ['#F12711', '#F5AF19'], angle: 135 },
      { id: 'bold-7', name: 'Tropical', colors: ['#11998E', '#38EF7D'], angle: 135 },
      { id: 'bold-8', name: 'Royal Purple', colors: ['#8E2DE2', '#4A00E0'], angle: 135 },
      { id: 'bold-9', name: 'Fire Storm', colors: ['#F83600', '#F9D423'], angle: 135 },
      { id: 'bold-10', name: 'Vivid Pro', colors: ['#7F00FF', '#E100FF'], angle: 135 },
      { id: 'bold-11', name: 'Cherry Pop', colors: ['#EB3349', '#F45C43'], angle: 135 },
      { id: 'bold-12', name: 'Lime Rush', colors: ['#56AB2F', '#A8E063'], angle: 135 },
    ],

    // ===== DARK & MOODY =====
    dark: [
      { id: 'dark-1', name: 'Midnight', colors: ['#232526', '#414345'], angle: 180 },
      { id: 'dark-2', name: 'Deep Space', colors: ['#0f0c29', '#302b63', '#24243e'], angle: 180 },
      { id: 'dark-3', name: 'Charcoal', colors: ['#1a1a2e', '#16213e', '#0f3460'], angle: 180 },
      { id: 'dark-4', name: 'Dark Ocean', colors: ['#141E30', '#243B55'], angle: 180 },
      { id: 'dark-5', name: 'Night Owl', colors: ['#1F1C2C', '#928DAB'], angle: 180 },
      { id: 'dark-6', name: 'Dark Knight', colors: ['#0F2027', '#203A43', '#2C5364'], angle: 180 },
      { id: 'dark-7', name: 'Obsidian', colors: ['#0a0a0a', '#1a1a1a', '#2a2a2a'], angle: 180 },
      { id: 'dark-8', name: 'Deep Purple', colors: ['#1a0a2e', '#2d1654', '#4a2080'], angle: 180 },
      { id: 'dark-9', name: 'Moody Blue', colors: ['#0D1117', '#161B22', '#21262D'], angle: 180 },
      { id: 'dark-10', name: 'Noir', colors: ['#000000', '#1a1a2e'], angle: 180 },
    ],

    // ===== WARM TONES =====
    warm: [
      { id: 'warm-1', name: 'Golden Hour', colors: ['#F09819', '#EDDE5D'], angle: 135 },
      { id: 'warm-2', name: 'Autumn', colors: ['#DAD299', '#B0DAB9'], angle: 135 },
      { id: 'warm-3', name: 'Terracotta', colors: ['#C46243', '#E8A87C', '#F6D5A8'], angle: 135 },
      { id: 'warm-4', name: 'Sunrise', colors: ['#FF512F', '#F09819'], angle: 135 },
      { id: 'warm-5', name: 'Honey', colors: ['#F6D365', '#FDA085'], angle: 135 },
      { id: 'warm-6', name: 'Amber', colors: ['#FFB347', '#FFCC33'], angle: 135 },
      { id: 'warm-7', name: 'Coral Reef', colors: ['#FF6B6B', '#FFC93C', '#66D2CE'], angle: 135 },
      { id: 'warm-8', name: 'Peach Sunset', colors: ['#FFDAB9', '#FF8C69', '#FF6347'], angle: 180 },
      { id: 'warm-9', name: 'Burnt Sienna', colors: ['#8B4513', '#CD853F', '#DEB887'], angle: 135 },
      { id: 'warm-10', name: 'Sandy Beach', colors: ['#F5F5DC', '#DEB887', '#D2691E'], angle: 180 },
    ],

    // ===== COOL TONES =====
    cool: [
      { id: 'cool-1', name: 'Arctic', colors: ['#74EBD5', '#ACB6E5'], angle: 135 },
      { id: 'cool-2', name: 'Frozen', colors: ['#89F7FE', '#66A6FF'], angle: 180 },
      { id: 'cool-3', name: 'Teal Dream', colors: ['#43E97B', '#38F9D7'], angle: 135 },
      { id: 'cool-4', name: 'Deep Blue', colors: ['#667EEA', '#764BA2'], angle: 135 },
      { id: 'cool-5', name: 'Aquamarine', colors: ['#1CD8D2', '#93EDC7'], angle: 135 },
      { id: 'cool-6', name: 'Sapphire', colors: ['#0652C5', '#D4418E'], angle: 135 },
      { id: 'cool-7', name: 'Ocean Breeze', colors: ['#2E3192', '#1BFFFF'], angle: 135 },
      { id: 'cool-8', name: 'Icy Lake', colors: ['#E6DADA', '#274046'], angle: 135 },
      { id: 'cool-9', name: 'Nordic Sky', colors: ['#A8C0FF', '#3F2B96'], angle: 135 },
      { id: 'cool-10', name: 'Glacier', colors: ['#E0F7FA', '#80DEEA', '#4DD0E1'], angle: 180 },
    ],

    // ===== NEUTRAL & CLEAN =====
    neutral: [
      { id: 'neutral-1', name: 'Paper White', colors: ['#FAFAFA', '#F0F0F0', '#E8E8E8'], angle: 180 },
      { id: 'neutral-2', name: 'Warm Gray', colors: ['#E0D8D0', '#C8BEB4'], angle: 180 },
      { id: 'neutral-3', name: 'Silver Mist', colors: ['#BDC3C7', '#ECF0F1'], angle: 180 },
      { id: 'neutral-4', name: 'Ivory', colors: ['#FFFFF0', '#FAF0E6', '#FFF5EE'], angle: 180 },
      { id: 'neutral-5', name: 'Stone', colors: ['#8E8D8A', '#B5B3B0', '#D8D6D3'], angle: 180 },
      { id: 'neutral-6', name: 'Cream', colors: ['#FFF8E7', '#FFE4C4', '#FFEFD5'], angle: 160 },
      { id: 'neutral-7', name: 'Smoke', colors: ['#96969C', '#AAAAB0', '#C8C8CC'], angle: 180 },
      { id: 'neutral-8', name: 'Parchment', colors: ['#F5F0E1', '#E8DCC8', '#DBD0B8'], angle: 180 },
    ],

    // ===== SUNSET & SUNRISE =====
    sunset: [
      { id: 'sunset-1', name: 'California', colors: ['#E55D87', '#5FC3E4'], angle: 135 },
      { id: 'sunset-2', name: 'Magic Hour', colors: ['#FA709A', '#FEE140'], angle: 135 },
      { id: 'sunset-3', name: 'Malibu', colors: ['#FF6A88', '#FF99AC', '#FCB045'], angle: 135 },
      { id: 'sunset-4', name: 'Pink Sunset', colors: ['#F953C6', '#B91D73'], angle: 135 },
      { id: 'sunset-5', name: 'Beach Glow', colors: ['#FDBB2D', '#22C1C3'], angle: 135 },
      { id: 'sunset-6', name: 'Dusk', colors: ['#2C3E50', '#FD746C', '#FF9068'], angle: 180 },
      { id: 'sunset-7', name: 'Horizon', colors: ['#FDC830', '#F37335'], angle: 135 },
      { id: 'sunset-8', name: 'Twilight', colors: ['#0F2027', '#203A43', '#F37335', '#F09819'], angle: 180 },
    ],

    // ===== NATURE INSPIRED =====
    nature: [
      { id: 'nature-1', name: 'Forest', colors: ['#134E5E', '#71B280'], angle: 135 },
      { id: 'nature-2', name: 'Spring Meadow', colors: ['#C9FFBF', '#FFAFBD'], angle: 135 },
      { id: 'nature-3', name: 'Lavender', colors: ['#C471F5', '#FA71CD'], angle: 135 },
      { id: 'nature-4', name: 'Sage', colors: ['#A8B5A2', '#D4DBC8', '#F0F0E4'], angle: 180 },
      { id: 'nature-5', name: 'Ocean Moss', colors: ['#004D40', '#00897B', '#4DB6AC'], angle: 180 },
      { id: 'nature-6', name: 'Wildflower', colors: ['#FF6B9D', '#C06C84', '#6C5B7B'], angle: 135 },
      { id: 'nature-7', name: 'Rain Forest', colors: ['#0B3D0B', '#1B5E20', '#388E3C'], angle: 180 },
      { id: 'nature-8', name: 'Desert Sand', colors: ['#C2956E', '#D4A574', '#E8C8A0'], angle: 180 },
    ],

    // ===== METALLIC & LUXURY =====
    luxury: [
      { id: 'luxury-1', name: 'Gold', colors: ['#BF953F', '#FCF6BA', '#B38728', '#FBF5B7'], angle: 135 },
      { id: 'luxury-2', name: 'Rose Gold', colors: ['#B76E79', '#E8B4B8', '#F5D6D8'], angle: 135 },
      { id: 'luxury-3', name: 'Platinum', colors: ['#8E9AAB', '#C4C4C4', '#EAEAEA'], angle: 135 },
      { id: 'luxury-4', name: 'Bronze', colors: ['#8B6914', '#CD853F', '#DAA520'], angle: 135 },
      { id: 'luxury-5', name: 'Champagne', colors: ['#F7E7CE', '#F0D5A8', '#E8C87C'], angle: 180 },
      { id: 'luxury-6', name: 'Black Gold', colors: ['#1a1a1a', '#3a3a1a', '#BF953F'], angle: 180 },
    ],
  };

  // ==================== STOCK PHOTO BACKGROUNDS ====================
  // Curated from Unsplash - stable CDN URLs
  // Format: https://images.unsplash.com/photo-{id}?w={w}&h={h}&fit=crop&auto=format&q=80

  const STOCK_PHOTOS = {

    // ===== HANDS HOLDING iPHONE =====
    handsPhone: [
      { id: 'hand-1', name: 'Hand Holding iPhone', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'hand-2', name: 'Using iPhone on Sofa', url: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'hand-3', name: 'Scrolling on Phone', url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'hand-4', name: 'Holding Phone Outdoor', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'hand-5', name: 'iPhone in Hand Close', url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'hand-6', name: 'Phone on Coffee Table', url: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'hand-7', name: 'Two Hands Typing', url: 'https://images.unsplash.com/photo-1529258283598-8d6fe60b27f4?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1529258283598-8d6fe60b27f4?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'hand-8', name: 'Hand & iPhone Flat', url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=200&h=200&fit=crop&auto=format&q=60' },
    ],

    // ===== iPHONE ON DESK / TABLE =====
    phoneDesk: [
      { id: 'pdesk-1', name: 'iPhone on White Desk', url: 'https://images.unsplash.com/photo-1519327232521-1ea2c736d34d?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1519327232521-1ea2c736d34d?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'pdesk-2', name: 'iPhone & MacBook', url: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'pdesk-3', name: 'Phone & Notebook', url: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'pdesk-4', name: 'iPhone & Coffee', url: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'pdesk-5', name: 'Workspace Flat Lay', url: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'pdesk-6', name: 'iPhone on Marble', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'pdesk-7', name: 'Phone & AirPods', url: 'https://images.unsplash.com/photo-1600086827875-a63b01f1335c?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1600086827875-a63b01f1335c?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'pdesk-8', name: 'iPhone Minimal Desk', url: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=200&h=200&fit=crop&auto=format&q=60' },
    ],

    // ===== iPHONE LIFESTYLE SCENES =====
    phoneLifestyle: [
      { id: 'plife-1', name: 'Woman Using Phone', url: 'https://images.unsplash.com/photo-1529148482759-b35b25c5f217?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1529148482759-b35b25c5f217?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'plife-2', name: 'Cafe Phone Session', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'plife-3', name: 'Phone in Bed', url: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'plife-4', name: 'Phone on Book Stack', url: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'plife-5', name: 'Morning Phone Check', url: 'https://images.unsplash.com/photo-1504890777-e0b3c2e1054e?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1504890777-e0b3c2e1054e?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'plife-6', name: 'Outdoor Phone Use', url: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=200&h=200&fit=crop&auto=format&q=60' },
    ],

    // ===== iPHONE MOCKUP STYLE =====
    phoneMockup: [
      { id: 'pmock-1', name: 'iPhone Silver Flat', url: 'https://images.unsplash.com/photo-1591337676887-a217a6c6da63?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1591337676887-a217a6c6da63?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'pmock-2', name: 'iPhone Angled View', url: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'pmock-3', name: 'iPhone Multiple', url: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'pmock-4', name: 'iPhone Pro Side', url: 'https://images.unsplash.com/photo-1580910051074-3eb694886571?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1580910051074-3eb694886571?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'pmock-5', name: 'Apple Devices', url: 'https://images.unsplash.com/photo-1507457379470-08b800bebc67?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1507457379470-08b800bebc67?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'pmock-6', name: 'iPhone Close-Up', url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=200&h=200&fit=crop&auto=format&q=60' },
    ],

    // ===== PHONE + COFFEE / COZY =====
    phoneCafe: [
      { id: 'pcafe-1', name: 'iPhone & Latte', url: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'pcafe-2', name: 'Phone & Espresso', url: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'pcafe-3', name: 'Morning Phone & Tea', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'pcafe-4', name: 'Cafe Scroll', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop&auto=format&q=60' },
    ],

    // ===== TECH FLAT LAYS (with iPhone) =====
    techFlatLay: [
      { id: 'tflat-1', name: 'Apple Ecosystem', url: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'tflat-2', name: 'Tech Desk Setup', url: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'tflat-3', name: 'Minimal Gadgets', url: 'https://images.unsplash.com/photo-1519327232521-1ea2c736d34d?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1519327232521-1ea2c736d34d?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'tflat-4', name: 'iPhone & Watch', url: 'https://images.unsplash.com/photo-1600086827875-a63b01f1335c?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1600086827875-a63b01f1335c?w=200&h=200&fit=crop&auto=format&q=60' },
      { id: 'tflat-5', name: 'Work From Home Setup', url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=1200&fit=crop&auto=format&q=80', thumb: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=200&fit=crop&auto=format&q=60' },
    ],
  };

  // ==================== CANVAS-GENERATED PATTERNS ====================

  const PATTERNS = [
    {
      id: 'pat-dots',
      name: 'Soft Dots',
      generate(ctx, W, H, accent) {
        const bg = accent || '#E8D5F5';
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        const dotColor = adjustBrightness(bg, -20);
        const spacing = W / 20;
        ctx.fillStyle = dotColor + '40';
        for (let x = spacing / 2; x < W; x += spacing) {
          for (let y = spacing / 2; y < H; y += spacing) {
            ctx.beginPath();
            ctx.arc(x, y, spacing * 0.15, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      },
    },
    {
      id: 'pat-grid',
      name: 'Subtle Grid',
      generate(ctx, W, H, accent) {
        const bg = accent || '#F0F0F0';
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        const lineColor = adjustBrightness(bg, -15);
        ctx.strokeStyle = lineColor + '30';
        ctx.lineWidth = 1;
        const spacing = W / 15;
        for (let x = 0; x < W; x += spacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
          ctx.stroke();
        }
        for (let y = 0; y < H; y += spacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }
      },
    },
    {
      id: 'pat-waves',
      name: 'Gentle Waves',
      generate(ctx, W, H, accent) {
        const colors = accent ? [accent, adjustBrightness(accent, 30)] : ['#C8B6FF', '#E2D1F9'];
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(1, colors[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
          const yOff = H * (0.15 + i * 0.11);
          ctx.beginPath();
          for (let x = 0; x <= W; x += 5) {
            const y = yOff + Math.sin((x / W) * Math.PI * 3 + i * 0.8) * (H * 0.03);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      },
    },
    {
      id: 'pat-circles',
      name: 'Floating Circles',
      generate(ctx, W, H, accent) {
        ctx.fillStyle = accent || '#1a1a2e';
        ctx.fillRect(0, 0, W, H);
        const circleColors = ['rgba(99,102,241,0.12)', 'rgba(168,85,247,0.10)', 'rgba(236,72,153,0.08)'];
        const rng = mulberry32(42);
        for (let i = 0; i < 20; i++) {
          const x = rng() * W;
          const y = rng() * H;
          const r = 30 + rng() * W * 0.15;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = circleColors[i % circleColors.length];
          ctx.fill();
        }
      },
    },
    {
      id: 'pat-diagonal',
      name: 'Diagonal Lines',
      generate(ctx, W, H, accent) {
        const bg = accent || '#F5F0E1';
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = adjustBrightness(bg, -12) + '35';
        ctx.lineWidth = 2;
        const spacing = W / 20;
        for (let i = -H; i < W + H; i += spacing) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + H, H);
          ctx.stroke();
        }
      },
    },
    {
      id: 'pat-confetti',
      name: 'Confetti',
      generate(ctx, W, H, accent) {
        ctx.fillStyle = accent || '#FAFAFA';
        ctx.fillRect(0, 0, W, H);
        const confettiColors = ['#FF6B6B40', '#4ECDC440', '#45B7D140', '#FFA07A40', '#98D8C840', '#C084FC40', '#818CF840'];
        const rng = mulberry32(123);
        for (let i = 0; i < 60; i++) {
          const x = rng() * W;
          const y = rng() * H;
          const w = 8 + rng() * 16;
          const h = 4 + rng() * 8;
          const rot = rng() * Math.PI;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rot);
          ctx.fillStyle = confettiColors[Math.floor(rng() * confettiColors.length)];
          ctx.fillRect(-w / 2, -h / 2, w, h);
          ctx.restore();
        }
      },
    },
    {
      id: 'pat-gradient-mesh',
      name: 'Soft Mesh',
      generate(ctx, W, H) {
        const colors = ['#C8B6FF', '#B8A9D9', '#F0C8D8', '#E0C3FC'];
        ctx.fillStyle = colors[0];
        ctx.fillRect(0, 0, W, H);
        const positions = [
          { x: 0.2, y: 0.2 }, { x: 0.8, y: 0.15 },
          { x: 0.75, y: 0.85 }, { x: 0.15, y: 0.8 },
        ];
        for (let i = 0; i < colors.length; i++) {
          const pos = positions[i];
          const radius = 0.5 * Math.max(W, H);
          const grad = ctx.createRadialGradient(
            pos.x * W, pos.y * H, 0,
            pos.x * W, pos.y * H, radius
          );
          grad.addColorStop(0, colors[i]);
          grad.addColorStop(0.5, colors[i] + '80');
          grad.addColorStop(1, colors[i] + '00');
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, W, H);
        }
        ctx.globalCompositeOperation = 'source-over';
      },
    },
    {
      id: 'pat-noise',
      name: 'Grain Texture',
      generate(ctx, W, H, accent) {
        const bg = accent || '#E8E8E8';
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        const imageData = ctx.getImageData(0, 0, W, H);
        const data = imageData.data;
        const rng = mulberry32(77);
        for (let i = 0; i < data.length; i += 4) {
          const noise = (rng() - 0.5) * 25;
          data[i] = Math.max(0, Math.min(255, data[i] + noise));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);
      },
    },
    {
      id: 'pat-blobs',
      name: 'Abstract Blobs',
      generate(ctx, W, H) {
        const grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, '#667eea');
        grad.addColorStop(1, '#764ba2');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
        const blobColors = ['rgba(255,255,255,0.08)', 'rgba(192,132,252,0.12)', 'rgba(129,140,248,0.1)'];
        const rng = mulberry32(55);
        for (let i = 0; i < 12; i++) {
          ctx.beginPath();
          const cx = rng() * W;
          const cy = rng() * H;
          const points = 6 + Math.floor(rng() * 4);
          const baseR = 50 + rng() * W * 0.2;
          for (let p = 0; p <= points; p++) {
            const angle = (p / points) * Math.PI * 2;
            const r = baseR * (0.7 + rng() * 0.6);
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            if (p === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fillStyle = blobColors[i % blobColors.length];
          ctx.fill();
        }
      },
    },
    {
      id: 'pat-stars',
      name: 'Starfield',
      generate(ctx, W, H) {
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#0f0c29');
        grad.addColorStop(0.5, '#302b63');
        grad.addColorStop(1, '#24243e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
        const rng = mulberry32(99);
        for (let i = 0; i < 200; i++) {
          const x = rng() * W;
          const y = rng() * H;
          const r = rng() * 2;
          const alpha = 0.3 + rng() * 0.7;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fill();
        }
      },
    },
  ];

  // ==================== SOLID COLORS ====================

  const SOLID_COLORS = [
    { id: 'solid-white', name: 'Pure White', color: '#FFFFFF' },
    { id: 'solid-offwhite', name: 'Off White', color: '#FAF9F6' },
    { id: 'solid-cream', name: 'Cream', color: '#FFFDD0' },
    { id: 'solid-ivory', name: 'Ivory', color: '#FFFFF0' },
    { id: 'solid-lavender', name: 'Lavender', color: '#E6E6FA' },
    { id: 'solid-lilac', name: 'Lilac', color: '#C8A2C8' },
    { id: 'solid-blush', name: 'Blush', color: '#FFD1DC' },
    { id: 'solid-peach', name: 'Peach', color: '#FFCBA4' },
    { id: 'solid-mint', name: 'Mint', color: '#AAFFC3' },
    { id: 'solid-skyblue', name: 'Sky Blue', color: '#87CEEB' },
    { id: 'solid-coral', name: 'Coral', color: '#FF7F7F' },
    { id: 'solid-sage', name: 'Sage', color: '#B2AC88' },
    { id: 'solid-mauve', name: 'Mauve', color: '#E0B0FF' },
    { id: 'solid-dustyrose', name: 'Dusty Rose', color: '#DCAE96' },
    { id: 'solid-charcoal', name: 'Charcoal', color: '#36454F' },
    { id: 'solid-navy', name: 'Navy', color: '#000080' },
    { id: 'solid-forest', name: 'Forest', color: '#228B22' },
    { id: 'solid-burgundy', name: 'Burgundy', color: '#800020' },
    { id: 'solid-slate', name: 'Slate', color: '#708090' },
    { id: 'solid-black', name: 'Black', color: '#000000' },
    { id: 'solid-taupe', name: 'Taupe', color: '#B5A99C' },
    { id: 'solid-dustyblue', name: 'Dusty Blue', color: '#6495AD' },
    { id: 'solid-terracotta', name: 'Terracotta', color: '#CC6633' },
    { id: 'solid-olive', name: 'Olive', color: '#808000' },
  ];

  // ==================== SIZE PRESETS ====================

  const SIZE_PRESETS = [
    { id: 'ig-square', name: 'Instagram Post', width: 1080, height: 1080, icon: 'square' },
    { id: 'ig-portrait', name: 'Instagram Portrait', width: 1080, height: 1350, icon: 'portrait' },
    { id: 'ig-story', name: 'Instagram Story', width: 1080, height: 1920, icon: 'story' },
    { id: 'fb-post', name: 'Facebook Post', width: 1200, height: 630, icon: 'landscape' },
    { id: 'twitter', name: 'Twitter / X Post', width: 1200, height: 675, icon: 'landscape' },
    { id: 'linkedin', name: 'LinkedIn Post', width: 1200, height: 627, icon: 'landscape' },
    { id: 'pinterest', name: 'Pinterest Pin', width: 1000, height: 1500, icon: 'tall' },
    { id: 'tiktok', name: 'TikTok Cover', width: 1080, height: 1920, icon: 'story' },
    { id: 'yt-thumb', name: 'YouTube Thumbnail', width: 1280, height: 720, icon: 'landscape' },
  ];

  // ==================== POST TEMPLATES ====================
  // Pre-configured designs based on the user's example images

  const TEMPLATES = [
    {
      id: 'tmpl-1',
      name: 'Center Focus',
      description: 'Phone centered, text on top',
      size: 'ig-square',
      background: { type: 'gradient', gradientId: 'brand-1' },
      phone: { x: 50, y: 60, scale: 52, rotation: 0 },
      texts: [
        { content: 'Your headline here.', font: 'Inter', size: 72, weight: 700, color: '#FFFFFF', x: 50, y: 5, align: 'center', lineHeight: 1.1, maxWidth: 85, letterSpacing: -1 },
        { content: 'Your subtitle goes here.', font: 'Inter', size: 36, weight: 400, color: '#FFFFFFCC', x: 50, y: 20, align: 'center', lineHeight: 1.3, maxWidth: 80, letterSpacing: 0 },
      ],
    },
    {
      id: 'tmpl-2',
      name: 'Left Text',
      description: 'Text left, phone right',
      size: 'ig-square',
      background: { type: 'gradient', gradientId: 'pastel-2' },
      phone: { x: 68, y: 55, scale: 50, rotation: 0 },
      texts: [
        { content: 'Bold\nStatement.', font: 'Inter', size: 80, weight: 800, color: '#1a1a2e', x: 22, y: 18, align: 'left', lineHeight: 1.05, maxWidth: 40, letterSpacing: -1 },
        { content: 'A calmer way to budget,\nday by day.', font: 'Inter', size: 32, weight: 400, color: '#444444', x: 22, y: 48, align: 'left', lineHeight: 1.3, maxWidth: 40, letterSpacing: 0 },
      ],
    },
    {
      id: 'tmpl-3',
      name: 'Bottom Text',
      description: 'Phone top, text at bottom',
      size: 'ig-square',
      background: { type: 'gradient', gradientId: 'brand-5' },
      phone: { x: 50, y: 40, scale: 48, rotation: 0 },
      texts: [
        { content: 'Save a little today.', font: 'Inter', size: 56, weight: 700, color: '#1a1a2e', x: 50, y: 80, align: 'center', lineHeight: 1.1, maxWidth: 90, letterSpacing: -1 },
        { content: 'Available now on the App Store.', font: 'Inter', size: 28, weight: 400, color: '#666666', x: 50, y: 90, align: 'center', lineHeight: 1.3, maxWidth: 80, letterSpacing: 0 },
      ],
    },
    {
      id: 'tmpl-4',
      name: 'Tilted Hero',
      description: 'Tilted phone with bold text',
      size: 'ig-square',
      background: { type: 'gradient', gradientId: 'brand-11' },
      phone: { x: 55, y: 58, scale: 55, rotation: -8 },
      texts: [
        { content: 'Control Your\nMoney.', font: 'Inter', size: 80, weight: 800, color: '#FFFFFF', x: 50, y: 4, align: 'center', lineHeight: 1.05, maxWidth: 90, letterSpacing: -2 },
        { content: 'No tracking required.', font: 'Inter', size: 32, weight: 400, color: '#FFFFFFBB', x: 50, y: 26, align: 'center', lineHeight: 1.3, maxWidth: 80, letterSpacing: 0 },
      ],
    },
    {
      id: 'tmpl-5',
      name: 'Story Minimal',
      description: 'Clean story format',
      size: 'ig-story',
      background: { type: 'gradient', gradientId: 'brand-3' },
      phone: { x: 50, y: 48, scale: 60, rotation: 0 },
      texts: [
        { content: 'Track an expense\nin seconds.', font: 'Inter', size: 72, weight: 700, color: '#FFFFFF', x: 50, y: 3, align: 'center', lineHeight: 1.1, maxWidth: 85, letterSpacing: -1 },
        { content: 'Just peace of mind.', font: 'Inter', size: 36, weight: 400, color: '#FFFFFFCC', x: 50, y: 16, align: 'center', lineHeight: 1.3, maxWidth: 80, letterSpacing: 0 },
        { content: 'Capture and categorise without fuss.', font: 'Inter', size: 28, weight: 400, color: '#FFFFFFAA', x: 50, y: 90, align: 'center', lineHeight: 1.3, maxWidth: 80, letterSpacing: 0 },
      ],
    },
    {
      id: 'tmpl-6',
      name: 'Story Bold',
      description: 'Bold story with large text',
      size: 'ig-story',
      background: { type: 'gradient', gradientId: 'pastel-6' },
      phone: { x: 50, y: 50, scale: 55, rotation: 0 },
      texts: [
        { content: 'Set one\nmonthly limit.', font: 'Inter', size: 84, weight: 900, color: '#1a1a2e', x: 50, y: 2, align: 'center', lineHeight: 1.05, maxWidth: 90, letterSpacing: -2 },
        { content: 'Spendaily turns it into a calm\ndaily number—with rollover.', font: 'Inter', size: 30, weight: 400, color: '#444444', x: 50, y: 18, align: 'center', lineHeight: 1.3, maxWidth: 80, letterSpacing: 0 },
      ],
    },
    {
      id: 'tmpl-7',
      name: 'Right Aligned',
      description: 'Phone left, text right',
      size: 'ig-square',
      background: { type: 'gradient', gradientId: 'neutral-4' },
      phone: { x: 32, y: 55, scale: 48, rotation: 3 },
      texts: [
        { content: 'Small Wins\nBuild Big\nMomentum', font: 'Inter', size: 60, weight: 700, color: '#1a1a2e', x: 75, y: 22, align: 'center', lineHeight: 1.1, maxWidth: 45, letterSpacing: -1 },
        { content: 'Track daily budgets visually.', font: 'Inter', size: 26, weight: 400, color: '#666666', x: 75, y: 58, align: 'center', lineHeight: 1.3, maxWidth: 42, letterSpacing: 0 },
      ],
    },
    {
      id: 'tmpl-8',
      name: 'Floating Card',
      description: 'Phone floating with shadow emphasis',
      size: 'ig-square',
      background: { type: 'gradient', gradientId: 'pastel-1' },
      phone: { x: 50, y: 55, scale: 45, rotation: -5 },
      texts: [
        { content: 'A calmer way to budget.', font: 'Inter', size: 64, weight: 700, color: '#1a1a2e', x: 50, y: 5, align: 'center', lineHeight: 1.1, maxWidth: 85, letterSpacing: -1 },
        { content: 'Stay on track, effortlessly.', font: 'Inter', size: 30, weight: 400, color: '#555555', x: 50, y: 20, align: 'center', lineHeight: 1.3, maxWidth: 80, letterSpacing: 0 },
      ],
    },
    {
      id: 'tmpl-9',
      name: 'Dark Mode',
      description: 'Dark gradient with white text',
      size: 'ig-square',
      background: { type: 'gradient', gradientId: 'dark-2' },
      phone: { x: 50, y: 60, scale: 52, rotation: 0 },
      texts: [
        { content: 'See your money\nclearly.', font: 'Inter', size: 72, weight: 700, color: '#FFFFFF', x: 50, y: 5, align: 'center', lineHeight: 1.1, maxWidth: 85, letterSpacing: -1 },
        { content: 'Understand every category at a glance.', font: 'Inter', size: 30, weight: 400, color: '#FFFFFFAA', x: 50, y: 24, align: 'center', lineHeight: 1.3, maxWidth: 80, letterSpacing: 0 },
      ],
    },
    {
      id: 'tmpl-10',
      name: 'Split Layout',
      description: 'Half gradient, half content',
      size: 'ig-square',
      background: { type: 'gradient', gradientId: 'brand-7' },
      phone: { x: 60, y: 52, scale: 60, rotation: 5 },
      texts: [
        { content: 'Spend less\ntoday,\nspend more\ntomorrow', font: 'Inter', size: 56, weight: 700, color: '#FFFFFF', x: 18, y: 15, align: 'left', lineHeight: 1.1, maxWidth: 35, letterSpacing: -1 },
      ],
    },
    {
      id: 'tmpl-11',
      name: 'Story Showcase',
      description: 'App showcase story format',
      size: 'ig-story',
      background: { type: 'gradient', gradientId: 'brand-1' },
      phone: { x: 50, y: 45, scale: 65, rotation: 0 },
      texts: [
        { content: 'Stay on top of\nyour spending.', font: 'Inter', size: 76, weight: 700, color: '#FFFFFF', x: 50, y: 2, align: 'center', lineHeight: 1.1, maxWidth: 85, letterSpacing: -1 },
        { content: 'Track, project, and reflect\non your progress.', font: 'Inter', size: 32, weight: 400, color: '#FFFFFFCC', x: 50, y: 14, align: 'center', lineHeight: 1.3, maxWidth: 80, letterSpacing: 0 },
        { content: 'Build awareness. Plan ahead.', font: 'Inter', size: 28, weight: 400, color: '#FFFFFFAA', x: 50, y: 90, align: 'center', lineHeight: 1.3, maxWidth: 80, letterSpacing: 0 },
      ],
    },
    {
      id: 'tmpl-12',
      name: 'Story Year View',
      description: 'Calendar year view showcase',
      size: 'ig-story',
      background: { type: 'gradient', gradientId: 'brand-13' },
      phone: { x: 50, y: 46, scale: 62, rotation: 0 },
      texts: [
        { content: 'Track your\nnewest habit.', font: 'Inter', size: 80, weight: 700, color: '#1a1a2e', x: 50, y: 2, align: 'center', lineHeight: 1.08, maxWidth: 90, letterSpacing: -2 },
        { content: 'Stay consistent. Set goals.\nWatch your progress.', font: 'Inter', size: 30, weight: 400, color: '#555555', x: 50, y: 16, align: 'center', lineHeight: 1.3, maxWidth: 80, letterSpacing: 0 },
        { content: 'Keep it up.', font: 'Inter', size: 28, weight: 500, color: '#555555', x: 50, y: 91, align: 'center', lineHeight: 1.3, maxWidth: 80, letterSpacing: 0 },
      ],
    },
    {
      id: 'tmpl-13',
      name: 'Landscape Banner',
      description: 'Wide format for Facebook/Twitter',
      size: 'fb-post',
      background: { type: 'gradient', gradientId: 'brand-1' },
      phone: { x: 72, y: 52, scale: 70, rotation: 0 },
      texts: [
        { content: 'Budget smarter,\nnot harder.', font: 'Inter', size: 68, weight: 700, color: '#FFFFFF', x: 25, y: 12, align: 'left', lineHeight: 1.1, maxWidth: 42, letterSpacing: -1 },
        { content: 'Download free on the App Store.', font: 'Inter', size: 28, weight: 400, color: '#FFFFFFBB', x: 25, y: 62, align: 'left', lineHeight: 1.3, maxWidth: 40, letterSpacing: 0 },
      ],
    },
    {
      id: 'tmpl-14',
      name: 'Pinterest Tall',
      description: 'Tall format for Pinterest',
      size: 'pinterest',
      background: { type: 'gradient', gradientId: 'pastel-5' },
      phone: { x: 50, y: 48, scale: 55, rotation: 0 },
      texts: [
        { content: 'Build lasting\nhabits with\nshort-term\nbudgeting', font: 'Inter', size: 72, weight: 700, color: '#FFFFFF', x: 50, y: 3, align: 'center', lineHeight: 1.05, maxWidth: 90, letterSpacing: -1 },
        { content: 'Try Spendaily free', font: 'Inter', size: 32, weight: 500, color: '#FFFFFFCC', x: 50, y: 88, align: 'center', lineHeight: 1.3, maxWidth: 80, letterSpacing: 0 },
      ],
    },
    {
      id: 'tmpl-15',
      name: 'Minimal Clean',
      description: 'Ultra minimal with lots of space',
      size: 'ig-square',
      background: { type: 'solid', color: '#F5F0EB' },
      phone: { x: 50, y: 58, scale: 42, rotation: 0 },
      texts: [
        { content: 'Spendaily', font: 'Inter', size: 48, weight: 700, color: '#1a1a2e', x: 50, y: 8, align: 'center', lineHeight: 1.1, maxWidth: 85, letterSpacing: -1 },
        { content: 'Know what you can spend. Every day.', font: 'Inter', size: 28, weight: 400, color: '#888888', x: 50, y: 16, align: 'center', lineHeight: 1.4, maxWidth: 80, letterSpacing: 0 },
      ],
    },
    {
      id: 'tmpl-16',
      name: 'Full Bleed',
      description: 'Phone fills the frame',
      size: 'ig-square',
      background: { type: 'gradient', gradientId: 'brand-10' },
      phone: { x: 50, y: 65, scale: 70, rotation: 0 },
      texts: [
        { content: 'Your daily\nbudget companion.', font: 'Inter', size: 64, weight: 700, color: '#FFFFFF', x: 50, y: 3, align: 'center', lineHeight: 1.1, maxWidth: 85, letterSpacing: -1 },
      ],
    },
    {
      id: 'tmpl-17',
      name: 'Elegant Dark',
      description: 'Luxury dark theme',
      size: 'ig-square',
      background: { type: 'gradient', gradientId: 'dark-5' },
      phone: { x: 50, y: 58, scale: 48, rotation: 3 },
      texts: [
        { content: 'Keep unspent budget\nfor when it\nmatters most', font: 'Inter', size: 58, weight: 600, color: '#FFFFFF', x: 50, y: 5, align: 'center', lineHeight: 1.12, maxWidth: 85, letterSpacing: -1 },
      ],
    },
    {
      id: 'tmpl-18',
      name: 'Warm Lifestyle',
      description: 'Warm tones with lifestyle feel',
      size: 'ig-square',
      background: { type: 'gradient', gradientId: 'warm-5' },
      phone: { x: 50, y: 55, scale: 50, rotation: -3 },
      texts: [
        { content: 'Made for\nreal life.', font: 'Inter', size: 80, weight: 800, color: '#1a1a2e', x: 50, y: 5, align: 'center', lineHeight: 1.05, maxWidth: 85, letterSpacing: -2 },
        { content: 'Budget without the stress.', font: 'Inter', size: 30, weight: 400, color: '#333333', x: 50, y: 24, align: 'center', lineHeight: 1.3, maxWidth: 80, letterSpacing: 0 },
      ],
    },
    {
      id: 'tmpl-19',
      name: 'Cool Professional',
      description: 'Professional blue tones',
      size: 'twitter',
      background: { type: 'gradient', gradientId: 'cool-4' },
      phone: { x: 75, y: 50, scale: 68, rotation: 5 },
      texts: [
        { content: 'Stay Social,\nStay on Track.', font: 'Inter', size: 60, weight: 700, color: '#FFFFFF', x: 25, y: 12, align: 'left', lineHeight: 1.1, maxWidth: 42, letterSpacing: -1 },
        { content: 'See your flexible daily limit.', font: 'Inter', size: 24, weight: 400, color: '#FFFFFFBB', x: 25, y: 58, align: 'left', lineHeight: 1.4, maxWidth: 42, letterSpacing: 0 },
      ],
    },
    {
      id: 'tmpl-20',
      name: 'Playful Pastel',
      description: 'Fun pastel with angled phone',
      size: 'ig-square',
      background: { type: 'gradient', gradientId: 'pastel-6' },
      phone: { x: 55, y: 55, scale: 50, rotation: 8 },
      texts: [
        { content: 'Money made\nsimple. ✨', font: 'Inter', size: 72, weight: 700, color: '#4A3560', x: 50, y: 5, align: 'center', lineHeight: 1.1, maxWidth: 85, letterSpacing: -1 },
      ],
    },
  ];

  // ==================== UTILITY FUNCTIONS ====================

  function mulberry32(a) {
    return function () {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function adjustBrightness(hex, amount) {
    hex = hex.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get all gradient categories with their items
   */
  function getGradientCategories() {
    return Object.entries(GRADIENTS).map(([key, items]) => ({
      key,
      label: getCategoryLabel(key),
      items,
    }));
  }

  function getCategoryLabel(key) {
    const labels = {
      brand: 'Spendaily Brand',
      pastel: 'Pastel Dreams',
      bold: 'Bold & Vibrant',
      dark: 'Dark & Moody',
      warm: 'Warm Tones',
      cool: 'Cool Tones',
      neutral: 'Neutral & Clean',
      sunset: 'Sunset & Sunrise',
      nature: 'Nature Inspired',
      luxury: 'Metallic & Luxury',
    };
    return labels[key] || key;
  }

  /**
   * Get all stock photo categories
   */
  function getStockCategories() {
    const labels = {
      handsPhone: 'Hands Holding iPhone',
      phoneDesk: 'iPhone on Desk',
      phoneLifestyle: 'iPhone Lifestyle',
      phoneMockup: 'iPhone Mockup Style',
      phoneCafe: 'Phone & Coffee',
      techFlatLay: 'Tech Flat Lays',
    };
    return Object.entries(STOCK_PHOTOS).map(([key, items]) => ({
      key,
      label: labels[key] || key,
      items,
    }));
  }

  /**
   * Find a gradient by ID
   */
  function getGradientById(id) {
    for (const items of Object.values(GRADIENTS)) {
      const found = items.find(g => g.id === id);
      if (found) return found;
    }
    return null;
  }

  /**
   * Find a stock photo by ID
   */
  function getStockPhotoById(id) {
    for (const items of Object.values(STOCK_PHOTOS)) {
      const found = items.find(p => p.id === id);
      if (found) return found;
    }
    return null;
  }

  /**
   * Get all gradients as a flat array
   */
  function getAllGradients() {
    return Object.values(GRADIENTS).flat();
  }

  /**
   * Get all stock photos as a flat array
   */
  function getAllStockPhotos() {
    return Object.values(STOCK_PHOTOS).flat();
  }

  /**
   * Get total background count
   */
  function getTotalCount() {
    const gradients = getAllGradients().length;
    const photos = getAllStockPhotos().length;
    const patterns = PATTERNS.length;
    const solids = SOLID_COLORS.length;
    return gradients + photos + patterns + solids;
  }

  // Public API
  return {
    GRADIENTS,
    STOCK_PHOTOS,
    PATTERNS,
    SOLID_COLORS,
    SIZE_PRESETS,
    TEMPLATES,
    getGradientCategories,
    getStockCategories,
    getGradientById,
    getStockPhotoById,
    getAllGradients,
    getAllStockPhotos,
    getTotalCount,
    getCategoryLabel,
    adjustBrightness,
  };

})();
