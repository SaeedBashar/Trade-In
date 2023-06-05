

const deleteProduct = async(btn)=>{
    const productId = btn.parentNode.querySelector("[name='productId']").value
    const _csrf = btn.parentNode.querySelector("[name='_csrf']").value

    const prodEl = btn.closest('.product-item');
    
    const res = await fetch('/admin/delete/' + productId, {
        method: 'DELETE',
        headers: {
            'csrf-token' : _csrf
        }
    })

    document.getElementsByClassName('modal-title')[0].innerHTML = 'INFORMATION'
    const data = await res.json()
    document.getElementsByClassName('modal-body')[0].innerHTML = data.msg
    document.getElementById('toggleModal').click();
    if(res.status === 200){
        prodEl.parentNode.removeChild(prodEl)
    }
}

const checkout = async()=>{

    const res = await fetch('/checkout');

    const resData = await res.json()
    window.location.assign(resData.data.authorization_url)
}
