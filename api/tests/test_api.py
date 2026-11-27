def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_lists_seeded_catalog(client):
    codes = [c["code"] for c in client.get("/v1/currencies").json()]
    assert codes == ["EUR", "INR", "USD"]
    vendor_ids = {v["id"] for v in client.get("/v1/vendors").json()}
    assert vendor_ids == {"gpu-cloud", "llm-api", "render-farm"}


def test_purchase_quote(client):
    res = client.post("/v1/quotes/purchase", json={"currency": "usd", "amount": "25"})
    assert res.status_code == 200
    body = res.json()
    assert body["currency"] == "USD"
    assert body["tokens"] == "2500.00"


def test_same_tokens_are_worth_different_amounts_per_vendor(client):
    gpu = client.post("/v1/quotes/redemption", json={"vendor_id": "gpu-cloud", "tokens": "500"})
    render = client.post(
        "/v1/quotes/redemption", json={"vendor_id": "render-farm", "tokens": "500"}
    )
    assert gpu.json()["units"] == "2.0000"
    assert gpu.json()["unit"] == "GPU-hour"
    assert render.json()["units"] == "125.0000"


def test_unknown_currency_and_vendor_return_404(client):
    res = client.post("/v1/quotes/purchase", json={"currency": "XYZ", "amount": "1"})
    assert res.status_code == 404
    res = client.post("/v1/quotes/redemption", json={"vendor_id": "nope", "tokens": "1"})
    assert res.status_code == 404


def test_rejects_non_positive_amount(client):
    res = client.post("/v1/quotes/purchase", json={"currency": "USD", "amount": "0"})
    assert res.status_code == 422
