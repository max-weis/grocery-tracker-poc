import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  interface Product {
    name: string
    price: number
    pricePerUnit: number
    quantity: number
  }
  
  interface ProductTableProps {
    products: Product[]
  }
  
  export function ProductTable({ products }: ProductTableProps) {
    if (products.length === 0) {
      return <p className="text-center text-gray-500">No products found.</p>
    }
  
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Price per Unit</TableHead>
            <TableHead>Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={index}>
              <TableCell>{product.name}</TableCell>
              <TableCell>€{product.price.toFixed(2)}</TableCell>
              <TableCell>€{product.pricePerUnit.toFixed(2)}</TableCell>
              <TableCell>{product.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }