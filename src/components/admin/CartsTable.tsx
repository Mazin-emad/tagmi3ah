import { useMemo, useState } from "react";
import { useGetAllCarts } from "@/hooks/useCart";
import { useAllUsers } from "@/hooks/useUsers";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CartsTable() {
	const { data: carts = [], isLoading } = useGetAllCarts();
	const { data: users = [], isLoading: usersLoading } = useAllUsers();
	const [openCartId, setOpenCartId] = useState<number | null>(null);

	const userById = useMemo(() => {
		const map = new Map<string | number, { name?: string; phoneNumber?: string; email?: string }>();
		users?.forEach((u: any) => map.set(u.id, { name: u.name, phoneNumber: u.phoneNumber, email: u.email }));
		return map;
	}, [users]);

	const getTotal = (cart: any): number => {
		if (typeof cart?.total === "number") return cart.total;
		if (typeof cart?.totalCost === "number") return cart.totalCost;
		if (Array.isArray(cart?.items)) {
			return cart.items.reduce((sum: number, it: any) => {
				const price = it.price ?? it.product?.price ?? 0;
				const qty = it.quantity ?? 1;
				return sum + price * qty;
			}, 0);
		}
		return 0;
	};

	if (isLoading || usersLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Carts</CardTitle>
				</CardHeader>
				<CardContent>Loading...</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>All Carts</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Phone</TableHead>
								<TableHead className="text-right">Total</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{carts.map((cart: any) => {
								const user = userById.get(cart.userId) || {};
								const total = getTotal(cart);
								return (
									<TableRow
										key={cart.id}
										className="cursor-pointer hover:bg-muted/50"
										onClick={() => setOpenCartId(cart.id)}
									>
										<TableCell className="whitespace-nowrap">
											{user.name || user.email || `User #${cart.userId}`}
										</TableCell>
										<TableCell className="whitespace-nowrap">
											{user.phoneNumber || "-"}
										</TableCell>
										<TableCell className="text-right">
											${total.toFixed(2)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</CardContent>

			{carts.map((cart: any) => {
				const open = openCartId === cart.id;
				const user = userById.get(cart.userId) || {};
				return (
					<Dialog open={open} onOpenChange={(v) => !v && setOpenCartId(null)} key={`dlg-${cart.id}`}>
						<DialogContent className="max-w-2xl">
							<DialogHeader>
								<DialogTitle>
									Cart #{cart.id} — {user.name || user.email || `User #${cart.userId}`}
								</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<div className="text-sm">
									<p><span className="font-medium">User ID:</span> {cart.userId}</p>
									<p><span className="font-medium">Phone:</span> {user.phoneNumber || "-"}</p>
								</div>
								<div className="overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Product</TableHead>
												<TableHead>Price</TableHead>
												<TableHead>Qty</TableHead>
												<TableHead className="text-right">Subtotal</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{(cart.items || []).map((it: any) => {
												const name = it.product?.name || `#${it.productId}`;
												const price = it.price ?? it.product?.price ?? 0;
												const qty = it.quantity ?? 1;
												const subtotal = price * qty;
												return (
													<TableRow key={it.id}>
														<TableCell className="max-w-[260px] truncate">{name}</TableCell>
														<TableCell>${price.toFixed(2)}</TableCell>
														<TableCell>{qty}</TableCell>
														<TableCell className="text-right">
															${subtotal.toFixed(2)}
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				);
			})}
		</Card>
	);
}


