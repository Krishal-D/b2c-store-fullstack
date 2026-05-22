export interface CartContextType {
    cartCount: number
    setCartCount: React.Dispatch<React.SetStateAction<number>>
    incrementCart: (quantity?: number) => void
}

export interface CartItem {
    id: number
    user_id: number
    product_id: number
    quantity: number
    created_at: string

    name: string
    description: string
    price: string
    image_url: string | null
    stock_quantity: number
}

export interface AddToCartResponse {
    cartItem: CartItem
    message: string
}

export interface CartResponse {
    cartItems: CartItem[]
}