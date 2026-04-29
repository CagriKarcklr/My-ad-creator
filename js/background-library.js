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
      { id: 'brand-16', name: 'Velvet Plum', colors: ['#4A2C6D', '#7D4FA3', '#C3A4E6'], angle: 165 },
      { id: 'brand-17', name: 'Orchid Mist', colors: ['#9D7DD8', '#C6A8EB', '#F1E8FF'], angle: 180 },
      { id: 'brand-18', name: 'Mulberry Sky', colors: ['#5E3A87', '#8A63B8', '#D6BCEB'], angle: 150 },
      { id: 'brand-19', name: 'Aster Glow', colors: ['#7251A1', '#A684C7', '#E8D9F7'], angle: 170 },
      { id: 'brand-20', name: 'Moonlit Iris', colors: ['#3E356B', '#6E64A8', '#B0A8D9', '#E0DAF2'], angle: 180 },
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
      { id: 'pastel-16', name: 'Milk Tea', colors: ['#F7E8D0', '#EFD3C5', '#DCC6E0'], angle: 170 },
      { id: 'pastel-17', name: 'Cloud Berry', colors: ['#FDE2E4', '#CDE7F0', '#D8F3DC'], angle: 150 },
      { id: 'pastel-18', name: 'Lilac Cream', colors: ['#E9D5FF', '#F5EFFF', '#FFF9FE'], angle: 180 },
      { id: 'pastel-19', name: 'Soft Apricot', colors: ['#FFE5B4', '#FFD6C0', '#FEE8D6'], angle: 160 },
      { id: 'pastel-20', name: 'Sunday Morning', colors: ['#EAF4FF', '#F3E8FF', '#FFF0F5'], angle: 165 },
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
      { id: 'bold-13', name: 'Volt Orange', colors: ['#f12711', '#f5af19', '#ffee55'], angle: 135 },
      { id: 'bold-14', name: 'Cyber Aqua', colors: ['#00f5ff', '#00bbf9', '#9b5de5'], angle: 140 },
      { id: 'bold-15', name: 'Crimson Beam', colors: ['#b31217', '#e52d27', '#ff8a00'], angle: 145 },
      { id: 'bold-16', name: 'Ultra Magenta', colors: ['#833ab4', '#fd1d1d', '#fcb045'], angle: 140 },
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
      { id: 'dark-11', name: 'Carbon Mist', colors: ['#0b0d10', '#1b2026', '#2f3742'], angle: 175 },
      { id: 'dark-12', name: 'Ink Violet', colors: ['#110f1a', '#241f3a', '#3e3561'], angle: 180 },
      { id: 'dark-13', name: 'Abyss', colors: ['#030b12', '#0b1a24', '#153648'], angle: 180 },
      { id: 'dark-14', name: 'Steel Night', colors: ['#121417', '#232a31', '#38424f'], angle: 170 },
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
      { id: 'warm-11', name: 'Paprika', colors: ['#c44536', '#e17055', '#fab1a0'], angle: 145 },
      { id: 'warm-12', name: 'Apricot Jam', colors: ['#ff9f43', '#feca57', '#ffdd95'], angle: 140 },
      { id: 'warm-13', name: 'Toffee Cream', colors: ['#9c6644', '#ddb892', '#ede0d4'], angle: 165 },
      { id: 'warm-14', name: 'Solar Flare', colors: ['#ff6b35', '#f7c59f', '#ffdd57'], angle: 135 },
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
      { id: 'cool-11', name: 'Ice Mint', colors: ['#d7fffe', '#9be7ff', '#80ffdb'], angle: 155 },
      { id: 'cool-12', name: 'Blue Steel', colors: ['#4b6cb7', '#182848', '#5f7da5'], angle: 170 },
      { id: 'cool-13', name: 'Polar Night', colors: ['#283e51', '#485563', '#6d7f94'], angle: 180 },
      { id: 'cool-14', name: 'Aqua Drift', colors: ['#2193b0', '#6dd5ed', '#b2fefa'], angle: 145 },
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
      { id: 'neutral-9', name: 'Linen', colors: ['#f8f4ef', '#eee6dc', '#e3d7ca'], angle: 175 },
      { id: 'neutral-10', name: 'Clay Gray', colors: ['#c6c1b9', '#d8d2c8', '#ece8df'], angle: 180 },
      { id: 'neutral-11', name: 'Fog Paper', colors: ['#f3f5f7', '#e7ebef', '#dfe4ea'], angle: 170 },
      { id: 'neutral-12', name: 'Soft Graphite', colors: ['#5b616b', '#7a828d', '#b7bec8'], angle: 180 },
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
      { id: 'sunset-9', name: 'Afterglow', colors: ['#ff7e5f', '#feb47b', '#ffd3a5'], angle: 145 },
      { id: 'sunset-10', name: 'Solar Peach', colors: ['#f76b1c', '#fad961', '#fcb69f'], angle: 140 },
      { id: 'sunset-11', name: 'Pink Ember', colors: ['#ee0979', '#ff6a00', '#ffd194'], angle: 135 },
      { id: 'sunset-12', name: 'Evening Tide', colors: ['#355c7d', '#6c5b7b', '#f67280', '#f8b195'], angle: 175 },
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
      { id: 'nature-9', name: 'Moss Valley', colors: ['#2c5f2d', '#97bc62', '#d8e9a8'], angle: 155 },
      { id: 'nature-10', name: 'Lagoon', colors: ['#006d77', '#83c5be', '#edf6f9'], angle: 160 },
      { id: 'nature-11', name: 'Terrace', colors: ['#606c38', '#a3b18a', '#dde5b6'], angle: 170 },
      { id: 'nature-12', name: 'Woodland Fog', colors: ['#4a5759', '#b0c4b1', '#edf2d0'], angle: 175 },
    ],

    // ===== METALLIC & LUXURY =====
    luxury: [
      { id: 'luxury-1', name: 'Gold', colors: ['#BF953F', '#FCF6BA', '#B38728', '#FBF5B7'], angle: 135 },
      { id: 'luxury-2', name: 'Rose Gold', colors: ['#B76E79', '#E8B4B8', '#F5D6D8'], angle: 135 },
      { id: 'luxury-3', name: 'Platinum', colors: ['#8E9AAB', '#C4C4C4', '#EAEAEA'], angle: 135 },
      { id: 'luxury-4', name: 'Bronze', colors: ['#8B6914', '#CD853F', '#DAA520'], angle: 135 },
      { id: 'luxury-5', name: 'Champagne', colors: ['#F7E7CE', '#F0D5A8', '#E8C87C'], angle: 180 },
      { id: 'luxury-6', name: 'Black Gold', colors: ['#1a1a1a', '#3a3a1a', '#BF953F'], angle: 180 },
      { id: 'luxury-7', name: 'Pearl', colors: ['#f7f7f2', '#ecebe4', '#d9d7cc'], angle: 175 },
      { id: 'luxury-8', name: 'Emerald Silk', colors: ['#0b6e4f', '#3fa34d', '#9ef01a'], angle: 150 },
      { id: 'luxury-9', name: 'Satin Silver', colors: ['#9ba5b1', '#c8d0d8', '#eef2f5'], angle: 170 },
      { id: 'luxury-10', name: 'Ruby Gold', colors: ['#7a0019', '#c1121f', '#f4a261', '#ffd166'], angle: 145 },
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
    {
      id: 'pat-ribbon-layers',
      name: 'Ribbon Layers',
      generate(ctx, W, H, accent) {
        const base = accent || '#B6AEDB';
        const deep = adjustBrightness(base, -34);
        const light = adjustBrightness(base, 42);
        const haze = adjustBrightness(base, 70);

        const baseGrad = ctx.createLinearGradient(0, 0, 0, H);
        baseGrad.addColorStop(0, haze);
        baseGrad.addColorStop(0.5, light);
        baseGrad.addColorStop(1, adjustBrightness(base, 22));
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, W, H);

        const ribbons = [
          { y: -0.06, h: 0.2, tint: deep, alpha: 0.18 },
          { y: 0.18, h: 0.17, tint: base, alpha: 0.24 },
          { y: 0.42, h: 0.19, tint: light, alpha: 0.2 },
          { y: 0.68, h: 0.21, tint: deep, alpha: 0.16 },
          { y: 0.86, h: 0.2, tint: base, alpha: 0.14 },
        ];

        ctx.save();
        ctx.translate(W * 0.5, H * 0.5);
        ctx.rotate(-0.08);
        ctx.translate(-W * 0.5, -H * 0.5);

        for (const ribbon of ribbons) {
          const y = H * ribbon.y;
          const h = H * ribbon.h;
          const grad = ctx.createLinearGradient(0, y, W, y + h);
          grad.addColorStop(0, `${ribbon.tint}00`);
          grad.addColorStop(0.2, `${ribbon.tint}${Math.round(ribbon.alpha * 255).toString(16).padStart(2, '0')}`);
          grad.addColorStop(0.8, `${ribbon.tint}${Math.round((ribbon.alpha * 0.7) * 255).toString(16).padStart(2, '0')}`);
          grad.addColorStop(1, `${ribbon.tint}00`);
          ctx.fillStyle = grad;
          ctx.fillRect(-W * 0.2, y, W * 1.4, h);
        }
        ctx.restore();
      },
    },
    {
      id: 'pat-fluid-glow',
      name: 'Fluid Glow',
      generate(ctx, W, H, accent) {
        const base = accent || '#8B7FD3';
        const bgGrad = ctx.createLinearGradient(0, 0, W, H);
        bgGrad.addColorStop(0, adjustBrightness(base, 18));
        bgGrad.addColorStop(1, adjustBrightness(base, -20));
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        const spots = [
          { x: 0.18, y: 0.2, r: 0.42, c: adjustBrightness(base, 70), a: 0.5 },
          { x: 0.82, y: 0.18, r: 0.36, c: adjustBrightness(base, 45), a: 0.42 },
          { x: 0.75, y: 0.78, r: 0.4, c: adjustBrightness(base, -5), a: 0.46 },
          { x: 0.22, y: 0.82, r: 0.34, c: adjustBrightness(base, 28), a: 0.38 },
        ];

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (const spot of spots) {
          const radius = Math.max(W, H) * spot.r;
          const g = ctx.createRadialGradient(
            spot.x * W, spot.y * H, 0,
            spot.x * W, spot.y * H, radius
          );
          g.addColorStop(0, `${spot.c}${Math.round(spot.a * 255).toString(16).padStart(2, '0')}`);
          g.addColorStop(0.55, `${spot.c}${Math.round((spot.a * 0.35) * 255).toString(16).padStart(2, '0')}`);
          g.addColorStop(1, `${spot.c}00`);
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
        }
        ctx.restore();
      },
    },
    {
      id: 'pat-wave-panels',
      name: 'Wave Panels',
      generate(ctx, W, H, accent) {
        const base = accent || '#A296DF';
        ctx.fillStyle = adjustBrightness(base, 46);
        ctx.fillRect(0, 0, W, H);

        const panelColors = [
          adjustBrightness(base, -18),
          adjustBrightness(base, 4),
          adjustBrightness(base, 28),
          adjustBrightness(base, -8),
        ];

        for (let i = 0; i < panelColors.length; i++) {
          const y0 = H * (0.08 + i * 0.22);
          const amp = H * (0.04 + i * 0.004);
          ctx.beginPath();
          ctx.moveTo(0, y0);
          for (let x = 0; x <= W; x += 8) {
            const y = y0 + Math.sin((x / W) * Math.PI * (1.6 + i * 0.35) + i * 0.9) * amp;
            ctx.lineTo(x, y);
          }
          const yBottom = y0 + H * 0.2;
          for (let x = W; x >= 0; x -= 8) {
            const y = yBottom + Math.sin((x / W) * Math.PI * (1.6 + i * 0.35) + i * 0.9 + 0.6) * amp;
            ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fillStyle = `${panelColors[i]}${Math.round(0.2 * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
        }
      },
    },
    {
      id: 'pat-orbital-noise',
      name: 'Orbital Noise',
      generate(ctx, W, H, accent) {
        const base = accent || '#7F74CC';
        const grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, adjustBrightness(base, -22));
        grad.addColorStop(1, adjustBrightness(base, 10));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        const rng = mulberry32(808);
        const colors = [
          adjustBrightness(base, 52),
          adjustBrightness(base, 28),
          adjustBrightness(base, -8),
        ];

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < 16; i++) {
          const x = rng() * W;
          const y = rng() * H;
          const r = (0.08 + rng() * 0.22) * Math.min(W, H);
          const c = colors[i % colors.length];
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, `${c}${Math.round(0.32 * 255).toString(16).padStart(2, '0')}`);
          g.addColorStop(1, `${c}00`);
          ctx.fillStyle = g;
          ctx.fillRect(x - r, y - r, r * 2, r * 2);
        }
        ctx.restore();

        const imageData = ctx.getImageData(0, 0, W, H);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const n = (rng() - 0.5) * 16;
          data[i] = Math.max(0, Math.min(255, data[i] + n));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
        }
        ctx.putImageData(imageData, 0, 0);
      },
    },
    {
      id: 'pat-folded-paper',
      name: 'Folded Paper',
      generate(ctx, W, H, accent) {
        const base = accent || '#B7ADE0';
        ctx.fillStyle = adjustBrightness(base, 58);
        ctx.fillRect(0, 0, W, H);

        const folds = [
          { points: [[0, 0.18], [1, 0.08], [1, 0.28], [0, 0.34]], c: adjustBrightness(base, 20), a: 0.45 },
          { points: [[0, 0.34], [1, 0.26], [1, 0.46], [0, 0.54]], c: adjustBrightness(base, 8), a: 0.38 },
          { points: [[0, 0.52], [1, 0.44], [1, 0.64], [0, 0.72]], c: adjustBrightness(base, -6), a: 0.34 },
          { points: [[0, 0.72], [1, 0.62], [1, 0.84], [0, 0.92]], c: adjustBrightness(base, 15), a: 0.32 },
        ];

        for (const fold of folds) {
          ctx.beginPath();
          ctx.moveTo(fold.points[0][0] * W, fold.points[0][1] * H);
          for (let i = 1; i < fold.points.length; i++) {
            ctx.lineTo(fold.points[i][0] * W, fold.points[i][1] * H);
          }
          ctx.closePath();
          ctx.fillStyle = `${fold.c}${Math.round(fold.a * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
        }
      },
    },
    {
      id: 'pat-liquid-slices',
      name: 'Liquid Slices',
      generate(ctx, W, H, accent) {
        const base = accent || '#7D78D8';
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, adjustBrightness(base, -28));
        bg.addColorStop(1, adjustBrightness(base, 24));
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const slices = [
          { x: 0.08, y: 0.18, w: 0.4, h: 0.16, c: adjustBrightness(base, 62) },
          { x: 0.45, y: 0.12, w: 0.48, h: 0.2, c: adjustBrightness(base, 28) },
          { x: 0.1, y: 0.42, w: 0.52, h: 0.18, c: adjustBrightness(base, 12) },
          { x: 0.4, y: 0.58, w: 0.5, h: 0.2, c: adjustBrightness(base, 44) },
          { x: 0.08, y: 0.76, w: 0.45, h: 0.16, c: adjustBrightness(base, -2) },
        ];

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (const slice of slices) {
          const x = slice.x * W;
          const y = slice.y * H;
          const w = slice.w * W;
          const h = slice.h * H;
          const g = ctx.createLinearGradient(x, y, x + w, y + h);
          g.addColorStop(0, `${slice.c}00`);
          g.addColorStop(0.15, `${slice.c}${Math.round(0.42 * 255).toString(16).padStart(2, '0')}`);
          g.addColorStop(0.85, `${slice.c}${Math.round(0.18 * 255).toString(16).padStart(2, '0')}`);
          g.addColorStop(1, `${slice.c}00`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(x, y + h * 0.5);
          ctx.bezierCurveTo(x + w * 0.22, y, x + w * 0.78, y + h, x + w, y + h * 0.45);
          ctx.bezierCurveTo(x + w * 0.75, y + h * 1.08, x + w * 0.25, y - h * 0.08, x, y + h * 0.5);
          ctx.fill();
        }
        ctx.restore();
      },
    },
    {
      id: 'pat-hex-lattice',
      name: 'Hex Lattice',
      generate(ctx, W, H, accent) {
        const base = accent || '#8C7CD8';
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, adjustBrightness(base, 34));
        bg.addColorStop(1, adjustBrightness(base, -12));
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const stroke = adjustBrightness(base, -24);
        const size = Math.max(18, W * 0.055);
        const h = Math.sqrt(3) * size;

        ctx.save();
        ctx.strokeStyle = `${stroke}44`;
        ctx.lineWidth = 1.2;

        for (let row = -1; row < H / h + 2; row++) {
          const y = row * h;
          const offset = row % 2 === 0 ? 0 : size * 1.5;
          for (let x = -size * 2; x < W + size * 2; x += size * 3) {
            const cx = x + offset;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              const a = (Math.PI / 3) * i + Math.PI / 6;
              const px = cx + Math.cos(a) * size;
              const py = y + Math.sin(a) * size;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
          }
        }
        ctx.restore();
      },
    },
    {
      id: 'pat-sunburst',
      name: 'Sunburst',
      generate(ctx, W, H, accent) {
        const base = accent || '#7E70CF';
        const centerX = W * 0.15;
        const centerY = H * 0.1;
        const bg = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(W, H));
        bg.addColorStop(0, adjustBrightness(base, 58));
        bg.addColorStop(0.45, adjustBrightness(base, 22));
        bg.addColorStop(1, adjustBrightness(base, -16));
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const rays = 40;
        const rayColor = adjustBrightness(base, -26);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.globalAlpha = 0.15;
        for (let i = 0; i < rays; i++) {
          const angle = (Math.PI * 2 * i) / rays;
          ctx.rotate(angle);
          ctx.fillStyle = rayColor;
          ctx.fillRect(0, -2, Math.max(W, H) * 1.2, 4);
          ctx.rotate(-angle);
        }
        ctx.restore();
      },
    },
    {
      id: 'pat-arc-flow',
      name: 'Arc Flow',
      generate(ctx, W, H, accent) {
        const base = accent || '#9A8AE0';
        const grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, adjustBrightness(base, 40));
        grad.addColorStop(1, adjustBrightness(base, -8));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        const rng = mulberry32(519);
        ctx.save();
        ctx.lineWidth = Math.max(2, W * 0.007);
        for (let i = 0; i < 24; i++) {
          const cx = (0.05 + rng() * 0.9) * W;
          const cy = (0.05 + rng() * 0.9) * H;
          const radius = (0.08 + rng() * 0.28) * Math.min(W, H);
          const start = rng() * Math.PI * 2;
          const end = start + (0.6 + rng() * 1.6) * Math.PI;
          ctx.strokeStyle = `${adjustBrightness(base, -18)}${Math.round((0.12 + rng() * 0.2) * 255).toString(16).padStart(2, '0')}`;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, start, end);
          ctx.stroke();
        }
        ctx.restore();
      },
    },
    {
      id: 'pat-cutout-rings',
      name: 'Cutout Rings',
      generate(ctx, W, H, accent) {
        const base = accent || '#8578D5';
        ctx.fillStyle = adjustBrightness(base, 46);
        ctx.fillRect(0, 0, W, H);

        const rings = [
          { x: 0.18, y: 0.2, r: 0.26, a: 0.2 },
          { x: 0.85, y: 0.12, r: 0.24, a: 0.16 },
          { x: 0.9, y: 0.82, r: 0.34, a: 0.18 },
          { x: 0.14, y: 0.78, r: 0.3, a: 0.15 },
        ];

        ctx.save();
        for (const ring of rings) {
          const cx = ring.x * W;
          const cy = ring.y * H;
          const outer = ring.r * Math.min(W, H);
          const inner = outer * 0.62;
          const ringGrad = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
          ringGrad.addColorStop(0, `${adjustBrightness(base, 12)}00`);
          ringGrad.addColorStop(0.7, `${adjustBrightness(base, -18)}${Math.round(ring.a * 255).toString(16).padStart(2, '0')}`);
          ringGrad.addColorStop(1, `${adjustBrightness(base, -28)}00`);
          ctx.fillStyle = ringGrad;
          ctx.fillRect(cx - outer, cy - outer, outer * 2, outer * 2);
        }
        ctx.restore();
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
    { id: 'solid-oat', name: 'Oat', color: '#E8DDCF' },
    { id: 'solid-sand', name: 'Sand', color: '#DCC7AA' },
    { id: 'solid-denim', name: 'Denim', color: '#3F5C7A' },
    { id: 'solid-midnightblue', name: 'Midnight Blue', color: '#191970' },
    { id: 'solid-pine', name: 'Pine', color: '#2E5E4E' },
    { id: 'solid-plum', name: 'Plum', color: '#6D3B74' },
    { id: 'solid-ruby', name: 'Ruby', color: '#A4133C' },
    { id: 'solid-charcoalmist', name: 'Charcoal Mist', color: '#4A4F57' },
    { id: 'solid-icegray', name: 'Ice Gray', color: '#D9E2EC' },
    { id: 'solid-moss', name: 'Moss', color: '#6A8F4E' },
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
