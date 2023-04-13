import TodoList from "@/components/Todo/TodoList";

export default function Home() {

  return (
    <main className="text-white font-extrabold">
      <h1 className="sm:text-3xl text-slate-900 tracking-tight dark:text-slate-200 text-5xl text-center my-7">Todo List</h1>
      <div className="mx-auto w-10/12">
        <TodoList />
      </div>
    </main>
  )

}
