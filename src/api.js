const API=import.meta.env.VITE_API_URL || 'https://main.d1a8ph253dil6n.amplifyapp.com/api';
async function request(path, options={}){
  const token=localStorage.getItem('rekyc_admin_token');
  const res=await fetch(`${API}${path}`,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{}) ,...(options.headers||{})}});
  const data=await res.json().catch(()=>({}));
  if(res.status===401&&token){localStorage.removeItem('rekyc_admin_token');location.href='/login';}
  if(!res.ok) throw new Error(data.message||'Request failed');
  return data;
}
export const api={
 login:(username,password)=>request('/admin/login',{method:'POST',body:JSON.stringify({username,password})}),
 stats:()=>request('/admin/dashboard/stats'),
 requests:(qs='')=>request(`/admin/requests${qs}`),
 detail:(id)=>request(`/admin/requests/${id}`),
 verify:(id,remarks)=>request(`/admin/requests/${id}/verify`,{method:'POST',body:JSON.stringify({remarks})}),
 skipPayment:(id)=>request(`/admin/requests/${id}/skip-payment`,{method:'POST'}),
 reject:(id,remarks)=>request(`/admin/requests/${id}/reject`,{method:'POST',body:JSON.stringify({remarks})}),
 signedPdfList:()=>request('/admin/esigned-pdfs'),
 signedPdfs:(id)=>request(`/admin/esigned-pdfs/${id}`),
 signedPdfUrl:(id,formType,mode)=>request(`/admin/esigned-pdfs/${id}/${formType}/download${mode==='preview'?'?mode=preview':''}`),
};
