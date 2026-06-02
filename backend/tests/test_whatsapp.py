from app.api.routes.whatsapp import _extract_messages, _format_analysis
from app.services.nutrition import build_analysis


def test_extract_messages_from_meta_payload():
    entries = [
        {
            "changes": [
                {
                    "value": {
                        "messages": [
                            {"from": "6590000000", "type": "text", "text": {"body": "nasi lemak for lunch"}}
                        ]
                    }
                }
            ]
        }
    ]

    messages = _extract_messages(entries)

    assert messages == [{"from": "6590000000", "text": "nasi lemak for lunch", "type": "text"}]


def test_format_analysis_for_whatsapp_reply():
    analysis = build_analysis("laksa")

    reply = _format_analysis(analysis)

    assert "Food AI SG analysis" in reply
    assert "Laksa" in reply
    assert "HPB score" in reply
