from flask import render_template, request
from flask_api import FlaskAPI, status, exceptions
from flask_api.decorators import set_renderers
from flask_api.renderers import JSONRenderer, HTMLRenderer
from pyfirebase import Firebase

import time

app = FlaskAPI(__name__, template_folder='.', static_folder='build')

firebase = Firebase('https://6ixtests.firebaseio.com')


@app.route('/scorer/<string:exam_id>/', methods=['POST'])
@set_renderers(JSONRenderer)
def scorer(exam_id):
    score = 0
    report_card = {'responses': {}}
    resp = request.get_json()
    user_responses = resp['data']
    user_id = resp['uid']
    answers_ref = firebase.ref('questions/{}/answers'.format(exam_id))
    answers = answers_ref.get()
    for q_id, correct_answer in answers.iteritems():
        # Convert to actual strings
        q_id, correct_answer = map(str, [q_id, correct_answer])
        status = {'is_correct': False}
        try:
            if user_responses[q_id] == correct_answer:
                status['is_correct'] = True
                score += 1
            status['correct_answer'] = correct_answer
            report_card['responses'][q_id] = status
        except KeyError as e:
            continue

    report_card['score'] = score
    report_card['created_on'] = time.time()

    submissions_ref = firebase.ref('submissions/{}/{}'.format(
        user_id, exam_id
        )
    )
    try:
        record = submissions_ref.push(report_card)
        report_card['id'] = record['name']
        return report_card
    except Exception as e:
        return "There was an error", status.HTTP_500_INTERNAL_SERVER_ERROR


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@set_renderers(HTMLRenderer)
def home(path):
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
