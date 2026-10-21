import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { tokens } from '../theme/tokens';
import { calculateDashboardStats, TimePeriod } from '../../reference/dashboardStats';

// Datos de prueba temporales estructurados según la referencia
const MOCK_ORDERS = [
  {
    id: 'ord-1',
    createdAt: new Date().toISOString(),
    total: 12.5,
    status: 'ENTREGADO',
    items: [
      { id: '1', name: 'Tacos al Pastor', quantity: 3, price: 2.5 },
      { id: '2', name: 'Horchata', quantity: 2, price: 2.5 },
    ],
  },
  {
    id: 'ord-2',
    createdAt: new Date().toISOString(),
    total: 8.0,
    status: 'ENTREGADO',
    items: [
      { id: '3', name: 'Gringora de Res', quantity: 2, price: 4.0 },
    ],
  },
];

export const StatsScreen: React.FC = () => {
  const [period, setPeriod] = useState<TimePeriod>('diario');

  // Cálculo de estadísticas reutilizando la lógica de reference/dashboardStats.ts
  const stats = calculateDashboardStats(MOCK_ORDERS as any, period);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Estadísticas</Text>

      {/* Selector de Período (Chips) */}
      <View style={styles.periodContainer}>
        {(['diario', 'semanal', 'mensual'] as TimePeriod[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodChip, period === p && styles.periodChipActive]}
            onPress={() => setPeriod(p)}
          >
            <Text
              style={[
                styles.periodText,
                period === p && styles.periodTextActive,
              ]}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tarjetas Principales de Métricas */}
      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Ingresos Totales</Text>
          <Text style={styles.cardValue}>${stats.totalRevenue.toFixed(2)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total de Pedidos</Text>
          <Text style={styles.cardValue}>{stats.totalOrders}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Ticket Promedio</Text>
          <Text style={styles.cardValue}>${stats.averageTicket.toFixed(2)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Turno Mañana / Noche</Text>
          <Text style={styles.cardSubValue}>
            M: ${stats.revenueByShift.morning.toFixed(2)} | N: ${stats.revenueByShift.night.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Top 5 Platillos Más Vendidos */}
      <View style={styles.cardFull}>
        <Text style={styles.sectionTitle}>Top Platillos Más Vendidos</Text>
        {stats.topDishes.length === 0 ? (
          <Text style={styles.emptyText}>No hay ventas registradas en este período.</Text>
        ) : (
          stats.topDishes.map((dish, index) => (
            <View key={dish.name} style={styles.dishRow}>
              <Text style={styles.dishRank}>{index + 1}.</Text>
              <Text style={styles.dishName}>{dish.name}</Text>
              <Text style={styles.dishQty}>{dish.quantity} unids.</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.paper,
  },
  content: {
    padding: tokens.spacing[16],
  },
  title: {
    fontFamily: tokens.fonts.heading,
    fontSize: 24,
    color: tokens.colors.cafe,
    marginBottom: tokens.spacing[16],
  },
  periodContainer: {
    flexDirection: 'row',
    marginBottom: tokens.spacing[16],
    gap: tokens.spacing[8],
  },
  periodChip: {
    paddingVertical: tokens.spacing[8],
    paddingHorizontal: tokens.spacing[16],
    borderRadius: tokens.radii.pill,
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  periodChipActive: {
    backgroundColor: tokens.colors.cobreTinte,
    borderColor: tokens.colors.cobre,
  },
  periodText: {
    fontFamily: tokens.fonts.body,
    color: tokens.colors.cafeClaro,
    fontSize: 14,
  },
  periodTextActive: {
    color: tokens.colors.cafe,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    gap: tokens.spacing[12],
    marginBottom: tokens.spacing[12],
  },
  card: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing[16],
    borderRadius: tokens.radii.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  cardFull: {
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing[16],
    borderRadius: tokens.radii.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    marginTop: tokens.spacing[8],
  },
  cardLabel: {
    fontFamily: tokens.fonts.body,
    fontSize: 12,
    color: tokens.colors.cafeClaro,
    marginBottom: tokens.spacing[4],
  },
  cardValue: {
    fontFamily: tokens.fonts.mono,
    fontSize: 20,
    fontWeight: 'bold',
    color: tokens.colors.cafe,
  },
  cardSubValue: {
    fontFamily: tokens.fonts.mono,
    fontSize: 14,
    color: tokens.colors.cafe,
    marginTop: tokens.spacing[4],
  },
  sectionTitle: {
    fontFamily: tokens.fonts.heading,
    fontSize: 16,
    color: tokens.colors.cafe,
    marginBottom: tokens.spacing[12],
  },
  dishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing[8],
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  dishRank: {
    fontFamily: tokens.fonts.mono,
    fontSize: 14,
    color: tokens.colors.cobre,
    width: 24,
  },
  dishName: {
    flex: 1,
    fontFamily: tokens.fonts.body,
    fontSize: 14,
    color: tokens.colors.cafe,
  },
  dishQty: {
    fontFamily: tokens.fonts.mono,
    fontSize: 14,
    color: tokens.colors.cafeClaro,
  },
  emptyText: {
    fontFamily: tokens.fonts.body,
    color: tokens.colors.cafeClaro,
    fontStyle: 'italic',
  },
});