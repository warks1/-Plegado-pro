import {useMemo,useState} from 'react';
import {Page} from '../../components/Page';
import {officialSources} from '../../data/officialSources';

export function OfficialSourcesPage(){
  const [query,setQuery]=useState('');
  const [organization,setOrganization]=useState('Todos');
  const organizations=[...new Set(officialSources.map(x=>x.organization))];
  const rows=useMemo(()=>officialSources.filter(x=>(organization==='Todos'||x.organization===organization)&&`${x.organization} ${x.title} ${x.scope}`.toLowerCase().includes(query.toLowerCase())),[query,organization]);
  return <Page title="Fuentes oficiales" subtitle="Conectores y catálogos autorizados para bibliotecas CAD y datos técnicos">
    <section className="panel library-toolbar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar fabricante, catálogo o formato"/><select value={organization} onChange={e=>setOrganization(e.target.value)}><option>Todos</option>{organizations.map(x=><option key={x}>{x}</option>)}</select></section>
    <section className="panel source-grid">{rows.map(source=><article className="source-card" key={source.id}><header><div><b>{source.organization}</b><strong>{source.title}</strong></div><span className={`source-access ${source.access}`}>{source.access==='public'?'Público':source.access==='account'?'Requiere cuenta':'Solicitud manual'}</span></header><p>{source.scope}</p><dl><div><dt>Formatos</dt><dd>{source.formats.join(', ')}</dd></div><div><dt>Verificado</dt><dd>{source.verifiedAt}</dd></div></dl><small>{source.notes}</small><a href={source.url} target="_blank" rel="noreferrer">Abrir fuente oficial</a></article>)}</section>
    <section className="panel notice"><b>Política de importación</b><p>Plegar Pro no marca un modelo como CAD oficial hasta conservar el archivo original, la fuente, la versión, la licencia y la verificación dimensional. Cuando una descarga exige cuenta del fabricante, el usuario deberá iniciar sesión y autorizar la importación.</p></section>
  </Page>
}
