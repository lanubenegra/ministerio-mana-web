
import rss from '@astrojs/rss';
export async function GET(context) {
  return rss({ title:'Ministerio Maná', description:'Noticias y devocionales', site: context.site?.toString() ?? 'http://localhost:4321', items: [] });
}
