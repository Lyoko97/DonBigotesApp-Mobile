// Módulo de Pedidos (Persona 3). Lo que la navegación de Persona 1 necesita:
//   Tab "Pedidos"        → <OrdersListScreen onOpenOrder={(id) => navigation.navigate("DetallePedido", { id })} isFocused={useIsFocused()} />
//   Stack "DetallePedido" → <OrderDetailScreen orderId={route.params.id} isFocused={useIsFocused()} />
export { OrdersListScreen } from "./OrdersListScreen";
export { OrderDetailScreen } from "./OrderDetailScreen";
