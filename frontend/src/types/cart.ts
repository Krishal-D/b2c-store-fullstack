export interface CartContextType {
    cartCount: number
    setCartCount: React.Dispatch<React.SetStateAction<number>>
    incrementCart: (quantity?: number) => void
}