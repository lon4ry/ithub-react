// Соответствует Pydantic-схеме Product в backend/main.py (поля в snake_case, как в API)
export interface Product {
  id: number
  title: string
  price: number
  category: string
  in_stock: boolean
}

// Дискриминированный union: невозможны комбинации вроде loading + error одновременно
export type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: T }
