"use client"
import { useState } from "react"

const initialData = [
  { id: 1, name: "Pizza", category: "Food", active: true },
  { id: 2, name: "Burger", category: "Food", active: false },
  { id: 3, name: "Cola", category: "Drink", active: true },
  { id: 4, name: "Water", category: "Drink", active: true },
  { id: 5, name: "Fries", category: "Food", active: false },
]

export default function Dashboard() {
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [selected, setSelected] = useState([])
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(1)

  const itemsPerPage = 3

  // 🔍 Поиск + фильтр
  let filtered = data.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  if (filter !== "all") {
    filtered = filtered.filter(item =>
      filter === "active" ? item.active : !item.active
    )
  }

  // 🔁 Сортировка
  filtered.sort((a, b) =>
    sortAsc
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  )

  // 📄 Пагинация
  const start = (page - 1) * itemsPerPage
  const paginated = filtered.slice(start, start + itemsPerPage)

  // ✅ Toggle active
  const toggleActive = (id) => {
    setData(data.map(item =>
      item.id === id ? { ...item, active: !item.active } : item
    ))
  }

  // ☑️ Select
  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  // 🚀 Bulk delete
  const bulkDelete = () => {
    setData(data.filter(item => !selected.includes(item.id)))
    setSelected([])
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* 🎯 FILTER */}
      <select onChange={e => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      {/* 🔁 SORT */}
      <button onClick={() => setSortAsc(!sortAsc)}>
        Sort {sortAsc ? "↓" : "↑"}
      </button>

      {/* 🚀 BULK */}
      <button onClick={bulkDelete}>
        Delete Selected
      </button>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Category</th>
            <th>Active</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map(item => (
            <tr key={item.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                />
              </td>

              <td>{item.name}</td>
              <td>{item.category}</td>

              <td>
                <button onClick={() => toggleActive(item.id)}>
                  {item.active ? "Active" : "Inactive"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📄 PAGINATION */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Prev
        </button>

        <span> Page {page} </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={start + itemsPerPage >= filtered.length}
        >
          Next
        </button>
      </div>
    </div>
  )
}