"use client"
import { useState } from "react"

export default function ProductForm() {
  const [step, setStep] = useState("basic")

  const [form, setForm] = useState({
    name: "",
    slug: "",
    desc: "",
    price: "",
    category: "",
    image: null,
    ar: null,
    allergens: [],
    tags: [],
    nutrition: "",
    active: true,
    sortOrder: 0,
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "name") {
      setForm({
        ...form,
        name: value,
        slug: value.toLowerCase().replaceAll(" ", "-"),
      })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const toggleArray = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }))
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Create Product</h1>

      {/* TABS */}
      <div style={{ marginBottom: 20 }}>
        {["basic", "media", "details", "availability"].map(tab => (
          <button key={tab} onClick={() => setStep(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {/* BASIC */}
      {step === "basic" && (
        <div>
          <input name="name" placeholder="Name" onChange={handleChange} />
          <br/><br/>
          <input name="slug" placeholder="Slug" value={form.slug} readOnly />
          <br/><br/>
          <textarea name="desc" placeholder="Description" onChange={handleChange} />
          <br/><br/>
          <input name="price" placeholder="Price" onChange={handleChange} />
          <br/><br/>
          <input name="category" placeholder="Category" onChange={handleChange} />
        </div>
      )}

      {/* MEDIA */}
      {step === "media" && (
        <div>
          <p>Image upload</p>
          <input type="file" onChange={(e) => setForm({...form, image: e.target.files[0]})} />

          <p>AR model upload</p>
          <input type="file" onChange={(e) => setForm({...form, ar: e.target.files[0]})} />

          {form.ar && <p>✅ AR Uploaded</p>}
        </div>
      )}

      {/* DETAILS */}
      {step === "details" && (
        <div>
          <p>Allergens:</p>
          {["milk", "nuts", "gluten"].map(a => (
            <label key={a}>
              <input
                type="checkbox"
                onChange={() => toggleArray("allergens", a)}
              />
              {a}
            </label>
          ))}

          <p>Dietary tags:</p>
          {["vegan", "halal", "keto"].map(t => (
            <label key={t}>
              <input
                type="checkbox"
                onChange={() => toggleArray("tags", t)}
              />
              {t}
            </label>
          ))}

          <p>Nutrition JSON</p>
          <textarea
            name="nutrition"
            placeholder='{"calories":100}'
            onChange={handleChange}
          />
        </div>
      )}

      {/* AVAILABILITY */}
      {step === "availability" && (
        <div>
          <label>
            Active:
            <input
              type="checkbox"
              checked={form.active}
              onChange={() =>
                setForm({...form, active: !form.active})
              }
            />
          </label>

          <br/><br/>

          <input
            name="sortOrder"
            type="number"
            placeholder="Sort order"
            onChange={handleChange}
          />
        </div>
      )}

      <br/><br/>

      {/* NAVIGATION */}
      <button onClick={() => console.log(form)}>
        SAVE
      </button>
    </div>
  )
}