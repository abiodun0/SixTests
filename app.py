from flask import Flask, render_template, request
from pyfirebase import Firebase

app = Flask(__name__, template_folder='.', static_folder='build')

firebase = Firebase('https://6ixtests.firebaseio.com')


@app.route('/scorer/:exam_id', methods=['POST'])
def scorer(exam_id):
    score = 0
    report_card = {'responses': {}}
    responses = request.get_json()
    answers_ref = firebase.ref('questions/{}/answers'.format(exam_id))
    answers = answers_ref.get()
    for q_id, correct_answer in answers:
        status = {'is_correct': False}
        if responses[q_id] == correct_answer:
            status['is_correct'] = True
            score += 1
        status['correct_answer'] = correct_answer
        report_card['responses'][q_id] = status
    report_card['score'] = score
    submissions_ref = firebase.ref('submissions/{}/{}'.format(user_id, exam_id))
    try:
        submissions_ref.push(report_card)
        return redirect('/')
    except Exception:
        return "There was an error"


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def home(path):
    return render_template('index.html')

if __name__ == '__main__':
    app.run()
