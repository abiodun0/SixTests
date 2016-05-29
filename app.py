from flask import Flask, render_template, request
from firebase import firebase
import os

server_port = os.getenv('PORT') or 5000
app = Flask(__name__, template_folder='.', static_folder='build')

firebase = firebase.FirebaseApplication(
    'https://6ixtests.firebaseio.com',
    None
)

@app.route('/scorer/:exam_id', methods=['POST'])
def scorer(exam_id):
    score = 0
    report_card = {'responses': {}}
    responses = request.get_json()
    answers = firebase.get('/questions/{}/answers'.format(exam_id), None)
    for q_id, correct_answer in answers:
        status = {'is_correct': False}
        if responses[q_id] == correct_answer:
            status['is_correct'] = True
            score += 1
        status['correct_answer'] = correct_answer
        report_card['responses'][q_id] = status
    report_card['score'] = score
    firebase.post('/submissions/{}/{}'.format(user_id, exam_id))
    return redirect('/')


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def home(path):
    return render_template('index.html')

if __name__ == '__main__':
    app.run(port=server_port, debug=True)
