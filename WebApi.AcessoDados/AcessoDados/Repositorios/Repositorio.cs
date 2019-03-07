using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Dados.AcessoDados;

namespace WebApi.Dados.AcessoDados.Repositorios
{
    public abstract class Repositorio<T, TId> : IRepositorio<T, TId>, IDisposable where T : class
    {
        protected ApplicationContext context;
        public DbSet<T> dbset;

        public Repositorio(ApplicationContext context)
        {
            this.context = context;
            this.dbset = context.Set<T>();
        }

        public void Atualizar(T entidade)
        {
            context.Update(entidade);
            //context.Entry(entidade).State = EntityState.Modified;
            context.SaveChanges();
        }

        public void Excluir(T entidade)
        {
            context.Remove(entidade);
            context.SaveChanges();
        }

        public void Inserir(T entidade)
        {
            context.Set<T>().Add(entidade);
            context.SaveChanges();
        }       

        public T SelecionarPorId(TId id)
        {
            return context.Set<T>().Find(id);
        }

        public Task<List<T>> SelecionarTodosAsync()
        {
            DbSet<T> dbset = context.Set<T>();
            var result =  dbset.ToListAsync();

            return Task.Run(()=> {
                return result;
            });
        }
        public List<T> SelecionarTodos()
        {
            DbSet<T> dbset = context.Set<T>();
            var result = dbset.ToList();
            
                return result;
           
        }

        public void Dispose()
        {
            context.Dispose();
        }
    }
}
